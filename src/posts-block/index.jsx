import React from 'react';
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import './index.less';

class PostsBlock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			key: ''
		};
	}

	componentDidMount() {
		const searchParams = this.props.location.search;
		const parsedSearchParams = queryString.parse(searchParams);
		const keyParam = parsedSearchParams.key ? parsedSearchParams.key : '';
		this.setState({
			key: keyParam
		});

		fetch(`/api/posts?key=${keyParam}`, {method: 'get'})
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

	render() {
		const posts = this.state.data.map((data) =>
			<li key={data._id}>
				<Link to={`/post/${data._id}?key=${this.state.key}`}>{data.title}</Link>
			</li>
		);

		return (
			<div className="block-wrapper">
				<h1>Posts</h1>
				<ul>
					{posts}
				</ul>
				<Link className="btn" to={`/new-post?key=${this.state.key}`}>New Post</Link>
			</div>
		);
	}
}

export default PostsBlock;
