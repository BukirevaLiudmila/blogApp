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
		const keyParam = parsedSearchParams.key ? parsedSearchParams.key : '';
		this.setState({
			key: keyParam
		});

		fetch(`/api/posts/${id}?key=${parsedSearchParams.key}`, {method: 'get'})
			.then((result) => {
				return result.json();
			})
			.then((result) => {
				if (result.error) {
					console.log(result.error);
					return;
				}
				if (result.data) {
					this.setState({
						data: result.data
					});
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
			.then((result) => {
				return result.json();
			})
			.then((result) => {
				if (result.result) {
					this.setState({
						data: []
					});
					this.showMessage();
				}
				if (result.error) {
					console.log(result.error);
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
