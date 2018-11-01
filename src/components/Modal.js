import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types'
import Close from '../assets/img/close.svg';

export default class Modal extends React.Component {

	static propTypes = {
		active: PropTypes.bool.isRequired,
		focusElem: PropTypes.string,
		handleClose: PropTypes.func.isRequired,
		returnFocusElem: PropTypes.object,
		title: PropTypes.string
	}

	state = {
		cachedScrollPosition: null
	}

	constructor(props) {
		super(props);
		this.el = document.createElement('div');
	}

	componentDidMount() {
		document.getElementById('modal-root').appendChild(this.el);

		document.body.addEventListener('keydown', (e) => {
			if(e.which === 27) {
				this.handleClose();
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.active) {
			this.setState({
				cachedScrollPosition: window.pageYOffset,
			}, () => {
				document.body.style.top = `-${this.state.cachedScrollPosition}px`;
				document.body.classList.add('is-fixed');
			});
		}
		else if (this.props.active && !nextProps.active) {
			document.body.style.removeProperty('top');
			document.body.classList.remove('is-fixed');
			window.scrollTo(0, this.state.cachedScrollPosition);
		}
	}

	handleKeyPress = (e) => {
		if (e.which === 13) {
			this.handleClose();
		}
	}

	handleClick = (e) => {
		try {
			if (e.target.classList.contains('c-modal')) {
				this.handleClose();
			}
		}
		catch(error) {
			console.log(error)
		}
	}

	handleClose = () => {
		this.props.handleClose(false);

		if(this.props.returnFocusElem) {
			this.props.returnFocusElem.focus();
		}
	}

	modalContent = () => {
		return (
			<div className='c-modal' onClick={(e) => this.handleClick(e)}>
				<div className='c-modal__wrapper'>
					 <div className='c-modal__title-wrapper'>
							{this.props.title ? <h1 className='t-beta c-modal__title'>{this.props.title}</h1> : ''}
							<img src={Close}
									className='c-modal__close'
									tabIndex='0' alt='Close Modal'
									onClick={this.handleClose}
									onKeyPress={(e) => this.handleKeyPress(e)} />
					 </div>
					 <div className='c-modal__box'>
							<div className='c-modal__content'>
								 {this.props.children}
							</div>
					 </div>
				</div>
			</div>
		)
	}

	render() {
		if(this.props.active) {
			return createPortal(
				this.modalContent(),
				this.el
			);
		}
		else {
			return false;
		}
	}
}
