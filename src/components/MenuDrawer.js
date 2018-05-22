import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Drawer from '@material-ui/core/Drawer';
import MenuList from 'components/MenuList';

class MenuDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
  }

  toggleDrawer = isOpen => () => {
    this.setState({ drawerOpen: isOpen });
  };

  render() {
    const { drawerOpen } = this.state;

    return (
      <React.Fragment>
        <IconButton onClick={this.toggleDrawer(true)}>
          <Icon>menu</Icon>
        </IconButton>

        <Drawer open={drawerOpen} onClose={this.toggleDrawer(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          >
            <MenuList />
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default MenuDrawer;
