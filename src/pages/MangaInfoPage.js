import React, { Component } from 'react';
import { mangaType, chapterType } from 'types';
import PropTypes from 'prop-types';
import MangaInfo from 'components/MangaInfo';
import { Client } from 'api';

// Honestly couldn't come up with a different name to differentiate it from MangaInfo component
// I might rename the other files in the /pages folder to include _Page at the end. I dunno...

// NOTE: Not currently automatically requesting server to rescrape data
//       for the chapter list and manga info.
//       I'm assuming the server would have already scraped once when the
//       user added a manga via the catalogue.

class MangaInfoPage extends Component {
  componentDidMount() {
    this.props.fetchMangaInfo();
    this.props.fetchChapters();
  }

  handleRefreshClick = () => {
    this.props.updateMangaInfo();
    this.props.updateChapters();
  };

  render() {
    const { mangaInfo, chapters, fetchOrRefreshIsLoading } = this.props;

    return (
      <MangaInfo
        mangaInfo={mangaInfo}
        chapters={chapters}
        initialTabValue={1}
        onBackClick={Client.library()}
        onRefreshClick={this.handleRefreshClick}
        isLoading={fetchOrRefreshIsLoading}
      />
    );
  }
}

MangaInfoPage.propTypes = {
  mangaInfo: mangaType,
  chapters: PropTypes.arrayOf(chapterType),

  fetchOrRefreshIsLoading: PropTypes.bool.isRequired,

  fetchChapters: PropTypes.func.isRequired,
  updateChapters: PropTypes.func.isRequired,
  fetchMangaInfo: PropTypes.func.isRequired,
  updateMangaInfo: PropTypes.func.isRequired,
};

// When data hasn't loaded yet, mangaInfo and chapters can be non-existant.
// That causes react to complain about propTypes, so set default values here.
MangaInfoPage.defaultProps = {
  mangaInfo: null,
  chapters: [],
};

export default MangaInfoPage;
