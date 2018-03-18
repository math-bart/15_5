App = React.createClass({

  getInitialState() {
    return {
      loading: false,
      searchingText: '',
      gif: {}
    };
  },

  handleSearch: function(searchingText) { // 1.
    this.setState({
      loading: true // 2.
    });

    this.getGif(searchingText).then (gif => { // 3.
      this.setState({ // 4
        loading: false, // a
        gif: gif, // b
        searchingText: searchingText // c
      });
    });
  },


  getGif: function(searchingText) { // 1
    return new Promise (
      (resolve, reject) => {
        const GIPHY_PUB_KEY = 'qYJUoExqhocza5OQXzJpzFgXT2AxuaGW';
        const GIPHY_API_URL = 'https://api.giphy.com';
        let url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText; // 2
        let xhr = new XMLHttpRequest(); // 3
        xhr.open('GET', url);
        xhr.onload = function() {
          if (this.status === 200) {
            let data = JSON.parse(xhr.responseText).data; // 4
            let gif = { // 5
              url: data.fixed_width_downsampled_url,
              sourceUrl: data.url
            };
            resolve(gif); // 6.
          }
          reject(new Error(this.statusText));
        };
        xhr.onerror = function () {
          reject(new Error(`XMLHttpRequest Error: ${this.statusText}`));
        };
        xhr.send();
      }
    );
  },


  render: function() {

    const styles = {
      margin: '0 auto',
      textAlign: 'center',
      width: '60%'
    };

    return (
      <div style={styles}>
        <h1>gif search engine!</h1>
        <p>Find gifs on
          <a href='http://giphy.com'>giphy.com</a> <br/>
          Press enter to download more.
        </p>
        <Search onSearch={this.handleSearch}/>
        <Gif
          loading={this.state.loading}
          url={this.state.gif.url}
          sourceUrl={this.state.gif.sourceUrl}
        />
      </div>
    );
  }
});
