
"use-strict";

import React, { Component } from "react";
import { processedImage, retreiveTestImage,processedImageAfter } from '../Bliffoscope';
import { Button, Grid, Row, Col } from 'react-bootstrap';

class StarShip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tornedoArray: [], starShip: [],
      finalTarget: [], isLoading: false, targetsFound: [],torpedoToBeMatch : "", matchArray : []
    };
    this.prepareTorpedoStarShipData.bind(this);
    this.plotMatchedTargetsOnTestData.bind(this);
    this.errorHandler.bind(this);
    this.deepClone.bind(this);
    this.clearStateData.bind(this);
  }

  prepareTorpedoStarShipData(selectedFiles) {
   this.clearStateData();
    // obtain input element through DOM 
    var slimeTorpedo = selectedFiles[0];
    var starShip = selectedFiles[1];
    var testData = selectedFiles[2];

    if (slimeTorpedo && starShip && testData) {
      this.getAsText(slimeTorpedo).then((data) => {
        this.setState({ tornedoArray: this.retrieveData(data) },()=>{
          this.getAsText(starShip).then((data) => {
            this.setState({ starShip: this.retrieveData(data) },()=>{
              this.getAsText(testData).then((data) => {
                this.setState({ finalTarget: this.retrieveData(data) });
                this.setState({ isLoading: true });
              },(evt)=>{
                this.errorHandler(evt);
              });
            },(evt)=>{
              this.errorHandler(evt);
            });
          },(evt)=>{
            this.errorHandler(evt);
          });
        });
      });

      // this.getAsText(starShip).then((data) => {
      //   this.setState({ starShip: this.retrieveData(data) });
      // });

      // this.getAsText(testData).then((data) => {
      //   this.setState({ finalTarget: this.retrieveData(data) });
      //   this.setState({ isLoading: true });
      // });
    }
  }

 errorHandler(evt){
  if(evt.target.error.code == evt.target.error.NOT_READABLE_ERR)
  {
     // The file could not be read
   document.getElementById('outputTorpedo').innerHTML = "Error reading file..."
   }
 }
  getAsText(readFile) {
    var reader;
    try {
      reader = new FileReader();
    } catch (e) {
      document.getElementById('outputTorpedo').innerHTML =
        "Error: seems File API is not supported on your browser";
      return;
    }
    return new Promise(function (resolve, reject) {
      reader.readAsText(readFile, "UTF-8");
      reader.onload = function () {
        resolve(reader.result);
      }
      reader.onerror = function(evt) {
        reject(evt);
      }
    });
  }

  retrieveData(data) {
    document.getElementById('outputTorpedo').innerHTML += data;
    this.setState({torpedoToBeMatch: data});
    return processedImage(data);
  }

  findTorpedo() {
    document.getElementById('outputStarShip').innerHTML = "";
    let tempArray = retreiveTestImage(this.deepClone(this.state.finalTarget),this.deepClone(this.state.tornedoArray));
    this.state.targetsFound = tempArray.targetsFound;
    this.setState({ targetsFound : tempArray.targetsFound },()=>{
      console.log(this.state.targetsFound);
    });
    this.setState({ matchArray: tempArray.matchArray },() => {
      this.plotMatchedTargetsOnTestData(this.deepClone(this.state.finalTarget),this.state.matchArray);
    });
    
  }
  
  findStarShip() {
    document.getElementById('outputStarShip').innerHTML = "";
    let tempArray = retreiveTestImage(this.deepClone(this.state.finalTarget), this.deepClone(this.state.starShip));
    this.state.targetsFound = tempArray.targetsFound;
    this.setState({ targetsFound : tempArray.targetsFound },()=>{
      console.log(this.state.targetsFound);
    });
    this.setState({ matchArray: tempArray.matchArray},()=>{
      this.plotMatchedTargetsOnTestData(this.deepClone(this.state.finalTarget),this.state.matchArray);
    });    
  }

  plotMatchedTargetsOnTestData(finalTarget,targetsFound) {
    let finalArray= [];
    if(targetsFound.length > 0){
      finalArray = processedImageAfter(finalTarget,targetsFound);   
      var finalTorpedo = ""; 
      for(let i =0;i< finalArray.length;i++){
        finalTorpedo += finalArray[i][3]; 
      }
      document.getElementById('outputStarShip').innerHTML = finalTorpedo;
    }
  }

  deepClone(input){
    return JSON.parse(JSON.stringify(input))
  }

  clearStateData(){
     this.setState({ tornedoArray: [], starShip: [],
      finalTarget: [], isLoading: false, targetsFound: [],torpedoToBeMatch : "",matchArray: []},()=>{
        document.getElementById('outputStarShip').innerHTML = "";
        document.getElementById('outputTorpedo').innerHTML = "";
        // document.getElementById('outputTargets').innerHTML = "";
      })
  
  }
  render() {
    const { isLoading } = this.state;
    return (
      <div className="App-intro">
        <Grid fluid={true}>
          <Row className="show-grid">
            <Col xs={12} md={2}>
              <Button bsStyle="primary" disabled={!isLoading} onClick={() => this.findTorpedo()}> search Torpedo </Button>
              <p></p>
              <Button bsStyle="primary" disabled={!isLoading} onClick={() => this.findStarShip()}> search Star Ship </Button>
            </Col>
            <Col xs={6} md={4}>
              <input id="file" type="file" accept=".blf" multiple onChange={(event) => { this.prepareTorpedoStarShipData(event.target.files) }} />
              
              <h3>File contents:</h3>
              <pre className="content-height">
                <code id="outputTorpedo">
                </code>
              </pre>
            </Col>
            <Col xs={12} md={6}>
            <pre>            
            {
                <ul>
                  {
                    this.state.targetsFound.map(function (coords) {                     
                      return <li key={(coords[0]+'.'+coords[1]).toString()}>{coords[0]} {coords[1]}</li>;
                    })
                  }
                </ul>
              }
            </pre>
            <pre className="content-height">              
              <code id="outputStarShip" className="content-height"></code>
              </pre>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default StarShip;