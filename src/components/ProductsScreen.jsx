import React, { Component } from 'react'
import axios from "config/axios";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Product from 'components/Product'
import PubSub from 'pubsub-js'
import Panel from 'components/Panel'
import AddInventory from "components/AddInventory";

export default class ProductsScreen extends Component {

    state = {
        products: [],
        sourceProducts: []
    }

    componentDidMount() {
        axios.get('/products')
            .then(response => {
                return response.data
            }
            )
            .then(data => {
                this.setState(state => ({
                    products: [...data, ...state.products],
                    sourceProducts: [...data, ...state.products]
                }))
            })
            .catch(error => {
                console.log(error);
            })

        this.token = PubSub.subscribe('search', (_, text) => {
            let _products = [...this.state.sourceProducts]
            // console.log('before filtering', _products);

            _products = _products.filter(product => {
                const matchedArray = product.name.match(new RegExp(text, 'gi'))
                // return matchedArray !== null
                return !!matchedArray
            })

            // console.log('after filtering', _products);
            this.setState({
                products: _products
            })
        })
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.token)
    }

    toAdd = () => {
        Panel.open({
            child: AddInventory
        })
    }

    render() {
        return (
            <div>
                <div className='products-screen'>
                    <div className="columns is-multiline is-desktop">
                        <TransitionGroup component={null}>
                            {this.state.products.map((product) =>
                            (
                                <CSSTransition classNames='product-fade' timeout={300} key={product.id}>
                                    <div className="column is-3" key={product.id}>
                                        <Product product={product} />
                                    </div>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </div>
                    <button className="button is-primary add-btn" onClick={this.toAdd}>add</button>
                </div>
            </div>
        )
    }
}