import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProductsFromCategoryAndQuery } from '../services/api';

export default class ProductList extends Component {
  state = {
    isEmpty: true,
    categories: [],
    category: '',
    inputSearch: '',
    products: '',
    isSearched: false,
    totalItems: 0,
    cartItems: localStorage.cartItems
      ? JSON.parse(localStorage.cartItems)
      : [],
  };

  componentDidMount() {
    this.loadCategories();
    this.countCartItems();
  }

  handleChange = ({ target }, callback = () => {}) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, callback);
  };

  handleProductsExhibition = async () => {
    const { inputSearch, category } = this.state;
    const responseAPI = await getProductsFromCategoryAndQuery(category, inputSearch);
    this.setState({
      isEmpty: false,
      products: responseAPI.results,
      isSearched: true,
    });
  };

  loadCategories = () => {
    getCategories().then((data) => this.setState({
      categories: data,
    }));
  };

  saveCartItem = ({ target }) => {
    const { products, cartItems } = this.state;
    const getItem = products.find((item) => item.id === target.id);
    const hadItem = cartItems.some((item) => item.id === getItem.id);
    if (!hadItem) {
      getItem.quantity = 1;
      cartItems.push(getItem);
      localStorage.cartItems = JSON.stringify(cartItems);
      this.setState({ cartItems });
    } else {
      cartItems.forEach((item) => {
        if (item.id === target.id && item.quantity < item.available_quantity) {
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
      isEmpty,
      categories,
      products,
      isSearched,
      inputSearch,
      totalItems,
    } = this.state;
    return (
      <div>
        <Link to="/shopping-cart" data-testid="shopping-cart-button">
          Carrinho de Compra
        </Link>
        <p data-testid="shopping-cart-size">
          {totalItems}
        </p>
        <input
          data-testid="query-input"
          name="inputSearch"
          value={ inputSearch }
          type="text"
          onChange={ this.handleChange }
          placeholder="Digite aqui"
        />
        <button
          data-testid="query-button"
          type="button"
          onClick={ this.handleProductsExhibition }
        >
          Salvar
        </button>
        {
          categories.map(({ id, name }) => (
            <label
              htmlFor={ id }
              key={ id }
              data-testid="category"
            >
              <input
                type="radio"
                name="category"
                id={ id }
                value={ id }
                onChange={ (event) => (
                  this.handleChange(event, this.handleProductsExhibition)
                ) }
              />
              { name }
            </label>
          ))
        }
        {isEmpty
          && (
            <p data-testid="home-initial-message">
              Digite algum termo de pesquisa ou escolha uma categoria.
            </p>
          )}
        {isSearched && ((products.length > 0)
          ? (
            products.map(({
              id,
              title,
              thumbnail,
              price,
              shipping: { free_shipping: freeShipping },
            }) => (
              // Coloquei Link dentro de uma div afim de inserir um botão de adicionar ao carrinho
              // O atributo Key foi realocado para a div pai pois não há necessidade de mantê-lá duplicada
              // Coloquei div de produtos em Link
              <div key={ id }>
                <Link
                  data-testid="product-detail-link"
                  to={ `/items/${id}` }
                >
                  <div
                    data-testid="product"
                  >
                    <h3>{ title }</h3>
                    <img src={ thumbnail } alt={ title } />
                    <p>{ price }</p>
                    { freeShipping && <p data-testid="free-shipping">Frete gratis</p> }
                  </div>
                </Link>
                <button
                  data-testid="product-add-to-cart"
                  type="button"
                  id={ id }
                  onClick={ this.saveCartItem }
                >
                  Adicionar ao carrinho
                </button>
              </div>
            ))
          )
          : (
            <p>
              Nenhum produto foi encontrado
            </p>
          ))}
      </div>
    );
  }
}
