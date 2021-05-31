import React, { useEffect, useState } from "react";
import GetNotes from "./GetNotes";
import "./Notes.css";
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import {
  Container,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Navbar
} from "reactstrap";
import { useHistory } from "react-router-dom";

function Notes() {
  let history = useHistory();

  const [allNotes, setAllNotes] = useState([]);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleClickAdd = () => {
    if (title !== "" && text !== "") {

      const opt = {
        method: 'POST',
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "title": title,
          "note": text
        })
      };
      fetch("/note", opt)
        .then(res => res.json())
        .then((data) => {
          setAllNotes(allNotes => [...allNotes, data.note]);
          console.log(data.note);
        })
      setTitle("");
      setText("");
    }
    else
      alert("Please add both title and note");
  }

  useEffect(() => {
    const opt = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      },
    };
    fetch("/note", opt)
      .then((res) => res.json())
      .then((data) => {
        setAllNotes(data.notes);
      });
  }, [setAllNotes]);

  const noteRemove = (id) => {
    if (id !== " ") {
      const opt = {
        method: 'DELETE',
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      };
      fetch('/note/' + id, opt)
        .then(res => res.json())
        .then((data) => { console.log(data); setAllNotes(allNotes => [...allNotes.filter(not => not.id !== id)]) })

    }
    else
      alert("id is not valid");

  }
  return (
    <div>
      <Navbar className="ms-auto" expand="md">
        <h1 id="title">Notes</h1>
        <Button color="danger" onClick={toggle}>Add Note</Button>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalBody>
            <Form>
              <FormGroup>
                <h4><Label>Title</Label></h4>
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <h4><Label>Note</Label></h4>
                <Input type="textarea" id="textarea" value={text} placeholder="Note something ..." onChange={(e) => setText(e.target.value)} />
              </FormGroup>
            </Form>
            <ModalFooter>
              <Button color="success" onClick={() => { toggle(); handleClickAdd(); }}>Add Note</Button>{' '}
              <Button color="danger" onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </ModalBody>
        </Modal>
        <Button
          onClick={() => {
            sessionStorage.removeItem("token");
            history.push("./login");
          }}
          id="log-out"
          outline
          color="danger"
        >
          Log out from App
        </Button>

      </Navbar>

      <Container>
        <Row sm="2" md="3">
          {allNotes.map((not) => (
            <GetNotes key={not.id} array={not} arrayTitle={not.title} arrayNote={not.note} removeNote={noteRemove} />
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Notes;
