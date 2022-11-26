import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Checkout extends Component {
  state = {
    checkoutItems: [],
    fullName: '',
    email: '',
    cpf: '',
    phone: '',
    cep: '',
    address: '',
    payment: '',
    hasError: false,
  };

  componentDidMount() {
    const { history } = this.props;
    const checkoutRecovered = JSON.parse(localStorage.getItem('cartItems'));
    if (!checkoutRecovered) {
      history.push('/');
    }
    this.setState({
      checkoutItems: checkoutRecovered,
    });
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  submitForm = () => {
    const { fullName, email,
      cpf, phone, cep, address, payment } = this.state;
    const { history } = this.props;
    const isValid = fullName.length > 0 && email.length > 0
    && cpf.length > 0 && phone.length > 0
    && cep.length > 0 && address.length > 0 && payment.length > 0;
    this.setState({
      hasError: !isValid,
    });
    if (isValid) {
      localStorage.clear();
      history.push('/');
    }
  };

  render() {
    const { checkoutItems, fullName, email,
      cpf, phone, cep, address, hasError } = this.state;
    return (
      <div>
        {
          checkoutItems.map(({ title, price, id, thumbnail }) => (
            <div key={ id }>
              <h3>{title}</h3>
              <img
                src={ thumbnail }
                alt={ title }
              />
              <p>{price}</p>
            </div>
          ))
        }
        {
          hasError && (<p data-testid="error-msg">Campos inválidos</p>)
        }
        <form onSubmit={ this.submitForm }>
          <label htmlFor="checkout-fullname">
            Nome Completo
            <input
              data-testid="checkout-fullname"
              name="fullName"
              type="text"
              value={ fullName }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="checkout-email">
            Email
            <input
              data-testid="checkout-email"
              name="email"
              type="email"
              value={ email }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="checkout-cpf">
            CPF
            <input
              data-testid="checkout-cpf"
              type="text"
              name="cpf"
              value={ cpf }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="checkout-phone">
            Telefone
            <input
              data-testid="checkout-phone"
              type="tel"
              name="phone"
              value={ phone }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="checkout-cep">
            CEP
            <input
              data-testid="checkout-cep"
              type="text"
              name="cep"
              value={ cep }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="checkout-address">
            Endereço
            <input
              data-testid="checkout-address"
              type="text"
              name="address"
              value={ address }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="boleto">
            Boleto
            <input
              data-testid="ticket-payment"
              name="payment"
              type="radio"
              id="boleto"
              value="Boleto"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="visa">
            Visa
            <input
              data-testid="visa-payment"
              name="payment"
              type="radio"
              id="visa"
              value="Visa"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="masterCard">
            MasterCard
            <input
              data-testid="master-payment"
              type="radio"
              id="masterCard"
              name="payment"
              value="MasterCard"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="elo">
            Elo
            <input
              data-testid="elo-payment"
              name="payment"
              type="radio"
              id="elo"
              value="Elo"
              onChange={ this.handleChange }
            />
          </label>
          <button data-testid="checkout-btn" type="submit">Finalizar compra</button>
        </form>
      </div>
    );
  }
}

Checkout.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
