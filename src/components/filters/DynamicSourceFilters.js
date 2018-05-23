// @flow
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import type { FiltersType } from 'types';
import FilterActions from './FilterActions';
import { filterElements } from './filterUtils';

// FIXME: Weird blue line when clicking the <FormGroup>

// FIXME: I think using cloneDeep here is getting really laggy.
//        Even after switching to non-lodash, still laggy.
//        May have to do actual object updates instead.

// Choosing to use a deep copy instead of the standard setState method
// It would be a huge pain to try updating an array of objects (and be less readable)
// https://stackoverflow.com/questions/29537299/react-how-do-i-update-state-item1-on-setstate-with-jsfiddle

const styles = {
  openButton: {
    marginBottom: 24,
    // Kinda hacking the UI for this together right now (right align)
    // https://stackoverflow.com/questions/6507014/how-to-space-the-children-of-a-div-with-css
    marginLeft: 'auto',
    marginRight: 8,
  },
  filters: {
    width: 250,
    marginLeft: 16,
    marginRight: 16,
    paddingBottom: 16,
    // Add margin to all children
    '& > *': { marginBottom: 16 },
  },
};

type Props = {
  classes: Object,
  filters?: FiltersType,
  onResetClick: Function,
  onSearchClick: Function,
  onFilterChange: Function,
};

type State = {
  drawerOpen: boolean,
};

class DynamicSourceFilters extends Component<Props, State> {
  static defaultProps = {
    filters: null,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
  }

  toggleDrawer = isOpen => () => {
    this.setState({ drawerOpen: isOpen });
  };

  render() {
    const {
      classes, filters, onSearchClick, onFilterChange, onResetClick,
    } = this.props;

    return (
      <React.Fragment>
        <Button
          variant="raised"
          color="primary"
          onClick={filters ? this.toggleDrawer(true) : () => null}
          className={classes.openButton}
        >
          Filters
        </Button>

        <Drawer anchor="right" open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
          <div tabIndex={0} role="button">
            <FilterActions onResetClick={onResetClick} onSearchClick={onSearchClick} />
            {filters && (
              <FormGroup className={classes.filters}>
                {filterElements(filters, onFilterChange)}
              </FormGroup>
            )}
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DynamicSourceFilters);
