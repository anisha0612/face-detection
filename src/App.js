import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Clarifai from "clarifai";
import ImageLinkForm from "./components/ImageLink/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Particles from "react-particles-js";
import "./App.css";

// Instantiate a new Clarifai app by passing in your API key.
const app = new Clarifai.App({ apiKey: process.env.REACT_APP_API_KEY });

const particleParameter = {
  particles: {
    number: {
      value: 50,
    },
    size: {
      value: 3,
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSigned: false,
    };
  }
  calculateFaceLocation = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("image");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      bottomRow: height - face.bottom_row * height,
      leftCol: face.left_col * width,
      rightCol: width - face.right_col * width,
      topRow: face.top_row * height,
    };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch((err) => {
        console.log(err);
      });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({ isSigned: false });
    } else if (route === "home") {
      this.setState({ isSigned: true });
    }
    this.setState({ route: route });
  };
  render() {
    const { isSigned, route, imageUrl, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particleParameter} />
        <Navigation isSigned={isSigned} onRouteChange={this.onRouteChange} />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
