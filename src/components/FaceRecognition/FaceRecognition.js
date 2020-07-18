import React from "react";

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute">
        <img
          id="image"
          alt="pic"
          src={imageUrl}
          width="500px"
          height="auto"
          className="mt3"
        />
        <div
          className="flex absolute flex-wrap center pointer shadow-2 ba bw2 b--light-blue "
          style={{
            top: box.topRow,
            left: box.leftCol,
            right: box.rightCol,
            bottom: box.bottomRow,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRecognition;
