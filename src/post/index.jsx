import React from 'react';
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import './index.less';

class Post extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			showMessage: false,
			textMessage: 'Post successfully deleted',
			key: ''
		};
		this.deletePost = this.deletePost.bind(this);
	}

	componentDidMount() {
		const id = this.props.match.params.id;
		const searchParams = this.props.location.search;
		const parsedSearchParams = queryString.parse(searchParams);
		this.setState({
			key: parsedSearchParams.key
		});
		fetch(`/api/posts/${id}?key=${parsedSearchParams.key}`, {method: 'get'})
			.then((res) => {
				return res.json();
			})
			.then((result) => {
				if (result.data) {
					this.setState({
						data: result.data
					});
				} else if (result.error) {
					console.log('Ошибка');
				}
			});
	}

	showMessage() {
		this.setState({
			showMessage: true
		});
		setTimeout(() => {
			this.setState({showMessage: false});
			this.props.history.push(`/?key=${this.state.key}`);
		}, 2500);
	}

	deletePost() {
		const id = this.props.match.params.id;
		fetch(`/api/posts/${id}?key=${this.state.key}`, {method: 'delete'})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				if (res.result) {
					this.setState({
						data: []
					});
					this.showMessage();
					console.log('Пост успешно удален');
				} else if (res.error) {
					console.log('Ошибка');
				}
			});
	}

	render() {
		const dataElem = this.state.data[0];
		const postTitle = dataElem ? dataElem.title : '';
		const postCategories = dataElem ? `Categories: ${dataElem.categories}` : '';
		const postContent = dataElem ? dataElem.content : '';

		const {showMessage, textMessage} = this.state;
		const messageText = showMessage
			? <div
				className="message-block success">{textMessage}</div>
			: '';

		return (
			<div className="block-wrapper">
				<h1>{postTitle}</h1>
				<h2 className="post-categories">{postCategories}</h2>
				<p className="post-content">{postContent}</p>
				{messageText}
				<div className="buttons">
					<Link className="btn" to={`/?key=${this.state.key}`}>
						Back
					</Link>
					<button className="btn delete"
						onClick={this.deletePost}>Delete</button>
				</div>
			</div>
		);
	}
}

export default Post;
