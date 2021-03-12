# Booking Calendar

A simple ReactJS booking system that can be easily deployed into Google Firebase free tier. It was created using CreateReactApp with typescript. Use of yarn as a package manager is recommended.

## Storybook

For a quick overview of the user experience, view the storybook at:
http://bookingsite-storybook.s3-website-ap-southeast-2.amazonaws.com/

## Setup

These instructions are a work in progress and are not guaranteed to work without complication. If you have an issue with setup create an issue and I'll improve this documentation.

### Configuration
You will need your own Google Firebase configuration file for web app as documented [here](https://support.google.com/firebase/answer/7015592?hl=en)

### Images
The login screen and background picture must be supplied separately. Images should be provided at a variety of resolutions and named like
`<horizontal_resolution>_<vertical_resolution>.jpg`
and located in the folder
`src/Images/Slideshow/<ImageName>/`
For each image, the file `src/Images/Slideshow/<ImageName>/index.ts` must be created to export each resolution and `src/Images/Slideshow/index.ts` should export that `<ImageName>`.
The repository contains a skeleton in `src/Images/Slideshow` to provide an example of how this should be done.

## Deployment

### Local Testing
A local snapshot of the current working directory can be viewed using

`yarn start`

### Deploy to Firebase
Assuming you have the firebase configuration files described in Setup, you can deploy using

`yarn deploy`
