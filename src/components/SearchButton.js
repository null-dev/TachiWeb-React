import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

class SearchButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVisible: false,
      searchText: '',
    };
    // TODO: Animate search bar in and out.
    //       I tried before, but was having trouble figuring out how to do it.

    // this.formControlRef = React.createRef();
    this.inputRef = React.createRef();

    // e.g. a property of Input would be
    // inputRef is Material-UI's non-standard way of handling refs
    // inputRef={(input) => {
    //   this.inputRef = input;
    // }}
  }

  handleClick = () => {
    this.setState({ searchVisible: true });
    // this.inputRef.focus();
  };

  handleChange = (event) => {
    this.setState({ searchText: event.target.value });
  };

  handleClearSearch = () => {
    // this.formControlRef
    // this.inputRef.blur(); // Remove focus from input
    this.setState({
      searchText: '',
      searchVisible: false,
    });
  };

  handleBlur = () => {
    // TODO: clicking on the search icon will call this because it's not part of the input
    //       not my intended interaction, but maybe not an important fix?
    if (!this.state.searchText) {
      this.setState({
        searchText: '',
        searchVisible: false,
      });
    }
  };

  render() {
    const { searchVisible, searchText } = this.state;

    return (
      <React.Fragment>
        <Tooltip title="Search">
          <IconButton onClick={this.handleClick}>
            <Icon>search</Icon>
          </IconButton>
        </Tooltip>

        {searchVisible ? (
          <FormControl>
            <InputLabel htmlFor="library-search-text">Search Library</InputLabel>
            <Input
              id="library-search-text"
              value={searchText}
              autoFocus
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={this.handleClearSearch}>
                    <Icon>close</Icon>
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        ) : null}
      </React.Fragment>
    );
  }
}

export default SearchButton;
