import React from 'react';
<<<<<<< HEAD
=======
import { withStyles } from 'material-ui/styles';
>>>>>>> 10dbf39b34016f43a7d3a0b649a1a27f4106cfbd

// TODO: I'd love to make the background image blurred, but I can't figure out how to right now.
//       blurring the root div directly blurs EVERYTHING on top. Might not be feasible =(

// * backgroundImage
// linear-gradient hack, put a white filter over the background image
const BackgroundImage = ({ thumbnailUrl, children }) => (
  <div
    style={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url(${thumbnailUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
    }}
  >
    {children}
  </div>
);

export default BackgroundImage;
