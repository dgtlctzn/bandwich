# Bandwich

![Example workstation](./public/img/bandwich-cover.png)

## Description 

Bandwich is a simple 4-track interface built with collaboration in mind. A Bandwich audio workstation can be used to share song ideas between users or collaborate on audio tracks. The project utilizes [Recorder.js](https://github.com/mattdiamond/Recorderjs) to record audio files in the browser and stores the Base64 data in a SQL database.

## Table of Contents

* [Dependencies](#Dependencies)
* [Usage](#usage)
* [Credits](#credits)
* [License](#license)


## Dependencies
A package.json is included in the repo with all the necessary dependencies. 


## Usage 
To start recording click the link below!

[Bandwich](https://bandwich-app.herokuapp.com/)

A user can either click on `new project` to create a blank workstation or click `View All Projects` to search for existing projects. New projects will be given a randomly generated name which can be changed at any point by clicking on the title. 
The workstation follows the same functionality of a classic 4 track tape recorder. To those not familiar with recording DAWs here are some basic tips: 
* To record on an individual track the record enable button must be toggled to select which track (1-4) you want to record on. 
* Once selected, the record button can be clicked to start recording.
* The stop button terminates the recording and the audio track is ready to be played back.
* The smaller play button on each track will play that track and that track alone. The big play button plays all recorded tracks simultaneously. 
* At any point you would like to redo a track just click the trash can symbol on the upper right side of the track. 

![Example workstation](./public/img/workstation.png)

## Credits

* [Recorder.js](https://www.npmjs.com/package/recorder-js)
* [Octavian Naicu](https://blog.addpipe.com/using-recorder-js-to-capture-wav-audio-in-your-html5-web-site/) 
* [Volume-meter.js](https://github.com/cwilso/volume-meter) 
* [Title Gen](https://github.com/dgtlctzn/API-title-generation) 
* [Body-parser](https://www.npmjs.com/package/body-parser) 
* [Wavefile](https://www.npmjs.com/package/wavefile) 



## License

MIT License

Copyright (c) 2020 Joseph Perry, Kai Reed, Andrew Stewart, and Patrick Hannan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.