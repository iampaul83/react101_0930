import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery'

class RepoList extends Component {
  constructor(params) {
    super(params);
    this.state = {
      loading: true,
      error: null,
      data: null
    };
  }
  render() {
    if (this.state.loading) {
      return <span>Loading...</span>;
    }
    else if (this.state.error !== null) {
      return <span>Error: {this.state.error.message}</span>;
    }
    else {
      var repos = this.state.data.items;
      var repoList = repos.map(function (repo, index) {
        return (
          <li key={index}><a href={repo.html_url}>{repo.name}</a> ({repo.stargazers_count} stars) <br/> {repo.description}</li>
        );
      });
      return (
        <main>
          <h1>Most Popular JavaScript Projects in Github</h1>
          <ol>{repoList}</ol>
        </main>
      );
    }
  }
  componentDidMount() {
    this.props.promise.then(
      value => this.setState({loading: false, data: value}),
      error => this.setState({loading: false, error: error}));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true
    })
    nextProps.promise.then(
      value => this.setState({loading: false, data: value}),
      error => this.setState({loading: false, error: error}));
  }
}


class App extends Component {
  constructor(params) {
    super(params);
    this.state = {
      search: 'javascript',
      // inputValue: 'javascript'
    }
  }
  render() {
    return (
      <div className="App">
        <input ref="myInput"/>
        <button onClick={() => { this.search() }}>Search</button>
        <RepoList promise={$.getJSON(`https://api.github.com/search/repositories?q=${this.state.search}&sort=stars&access_token=c4af530b3e031146f7e3ff4ce17088666b92db2c`)} />
      </div>
    );
  }

  componentDidMount() {
    this.refs.myInput.value = this.state.search
  }

  search() {
    this.setState((prevState) => {
      return {
        search: this.refs.myInput.value
      }
    })
  }
}

export default App;
