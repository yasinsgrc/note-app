
import React from "react";
import {Col,Card,CardTitle,CardText,Button} from "reactstrap";
import "./GetNotes.css";

const GetNotes = ({arrayNote ,arrayTitle,removeNote,array}) => {
  


  return (
      <Col xs="6" sm="4">
        <Card id="grid">
          <CardTitle tag="h5">{arrayTitle}</CardTitle>
          <CardText>{arrayNote}</CardText>
           <Button onClick={(e)=>removeNote(array.id)} outline color="danger">
            Delete
          </Button>
        </Card>
      </Col>
  );
};
export default GetNotes;