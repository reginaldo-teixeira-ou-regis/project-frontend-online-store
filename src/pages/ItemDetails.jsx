import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getProductById } from '../services/api';

class ItemDetails extends Component {
  state = {
    id: '',
    message: '',
    email: '',
    rate: '',
    product: {},
    rateChecked: [{ id: 1, checked: false },
      { id: 2, checked: false },
      { id: 3, checked: false },
      { id: 4, checked: false },
      { id: 5, checked: false }],
    isInvalid: false,
    reviews: [],
    cartItems: localStorage.cartItems
      ? JSON.parse(localStorage.cartItems)
      : [],
    totalItems: 0,
  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    const reviews = JSON.parse(localStorage.getItem(id));
    this.handleItemsDetails();
    this.countCartItems();
    if (reviews) {
      this.setState({
        reviews,
      });
    }
  }

  // Chamada do resultado da API
  handleItemsDetails = async () => {
    const { match: { params: { id } } } = this.props;
    const responseAPI = await getProductById(id);
    this.setState({
      product: responseAPI,
    });
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });

    if (target.type === 'radio') {
      this.setState(({ rateChecked }) => ({
        rateChecked: rateChecked.map((_bool, index) => (
          {
            id: index + 1,
            checked: (Number(target.id) === index + 1),
          }
        )),
      }));
    }
  };

  onClickSubmitButton = () => {
    const { email, rate, message } = this.state;
    const { match: { params: { id } } } = this.props;
    if (email.length <= 0 || rate.length <= 0 || !email.match(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm)) {
      this.setState({
        isInvalid: true,
      });
    } else {
      this.setState(({ reviews }) => ({
        isInvalid: false,
        message: '',
        email: '',
        rateChecked: [{ id: 1, checked: false },
          { id: 2, checked: false },
          { id: 3, checked: false },
          { id: 4, checked: false },
          { id: 5, checked: false }],
        reviews: [...reviews, {
          email,
          rating: rate,
          text: message,
        }],
      }), () => {
        const { reviews } = this.state;
        localStorage.setItem(id, JSON.stringify(reviews));
      });
    }
  };

  saveProductLocalStorage = () => {
    const { product, cartItems } = this.state;
    const hadItem = cartItems.some((item) => item.id === product.id);
    if (!hadItem) {
      product.quantity = 1;
      cartItems.push(product);
      localStorage.cartItems = JSON.stringify(cartItems);
      this.setState({ cartItems });
    } else {
      cartItems.forEach((item) => {
        if (item.id === product.id && item.quantity < item.available_quantity) {
          item.quantity += 1;
        }
      });
      localStorage.cartItems = JSON.stringify(cartItems);
      this.setState({ cartItems });
    }
    this.countCartItems();
  };

  countCartItems = () => {
    const { cartItems } = this.state;
    const totalItems = cartItems
      .reduce((total, { quantity }) => total + quantity, 0) ?? 0;
    this.setState({ totalItems });
    localStorage.totalItems = totalItems;
  };

  render() {
    const {
      handleChange,
      onClickSubmitButton,
      state: {
        product: {
          title,
          thumbnail,
          price,
          freeShipping,
        },
        email,
        message,
        isInvalid,
        rateChecked,
        reviews,
        id,
        totalItems,
      } } = this;
    return (
      <div key={ id }>
        <Link
          to="/shopping-cart"
          data-testid="shopping-cart-button"
        >
          Carrinho de Compras
        </Link>
        <p data-testid="shopping-cart-size">
          { totalItems }
        </p>
        <div>
          <h2 data-testid="product-detail-name">
            { title }
          </h2>
          <img
            data-testid="product-detail-image"
            src={ thumbnail }
            alt={ title }
          />
          <span data-testid="product-detail-price">{ price }</span>
          { freeShipping && <span>Frete grátis</span> }
          <button
            data-testid="product-detail-add-to-cart"
            type="button"
            onClick={ this.saveProductLocalStorage }
          >
            Adicionar ao carrinho
          </button>

        </div>
        <div>
          <form>
            <input
              data-testid="product-detail-email"
              type="email"
              placeholder="Email"
              name="email"
              onChange={ handleChange }
              value={ email }
            />
            { rateChecked.map(({ checked }, index) => (
              <label key={ `${index + 1}-rating` } htmlFor={ index + 1 }>
                <input
                  data-testid={ `${index + 1}-rating` }
                  type="radio"
                  name="rate"
                  id={ index + 1 }
                  value={ index + 1 }
                  checked={ checked }
                  onChange={ handleChange }
                />
                { index + 1 }
              </label>
            )) }
            <textarea
              data-testid="product-detail-evaluation"
              placeholder="Mensagem (opcional)"
              onChange={ handleChange }
              name="message"
              value={ message }
            />
            <button
              data-testid="submit-review-btn"
              type="button"
              onClick={ onClickSubmitButton }
            >
              Avaliar
            </button>
            { isInvalid && <span data-testid="error-msg">Campos inválidos</span> }
          </form>
          <div>
            { reviews
              .map(({ email: emailReview, rating, text }, index) => (
                <div
                  key={ `review-${emailReview}-${index}` }
                >
                  <h4 data-testid="review-card-email">{ emailReview }</h4>
                  <span data-testid="review-card-rating">{ rating }</span>
                  <p data-testid="review-card-evaluation">{ text }</p>
                </div>
              )) }
          </div>
        </div>
      </div>
    );
  }
}

ItemDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default ItemDetails;
