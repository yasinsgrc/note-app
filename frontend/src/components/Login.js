
import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Card } from 'reactstrap';
import "./Login.css";
import { useHistory } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let history = useHistory();
    const redirect = () => {
        history.push('./Notes')
    }

    const handleClick = () => {
        if (sessionStorage.getItem("token") !== null) {
            redirect();
        }
        else {
            const opt = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            }

            fetch("/login", opt)
                .then(res => {
                    if (res.status === 401) alert("Please check the username and password");
                    else {
                        res.json().then(data => {
                            sessionStorage.setItem("token", data.access_token);
                            redirect();
                        })
                    }
                })
                .catch(error => {
                    console.error("There was some error!!!", error);
                })
        }
    }
    return (
        <div>
            <Container className="Login">
                <Row>
                    <Col sm={{ size: 6, offset: 3 }}>
                        <Card className="border">
                            <Form className="form-login">
                                <FormGroup>
                                    <h3 style={{ margin: "15px" }}><Label for="name">Username</Label></h3>
                                    <Input className="border" value={username} style={{ height: '3rem', width: '60%', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', }} type="text" name="name" id="name" placeholder="Name" onChange={(e) => setUsername(e.target.value)} />
                                </FormGroup>
                                <FormGroup>
                                    <h3 style={{ margin: "10px" }}><Label for="examplePassword">Password</Label></h3>
                                    <Input className="border" value={password} style={{ height: '3rem', width: '60%', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }} type="password" name="password" id="examplePassword" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                                </FormGroup>
                                <Button onClick={handleClick} id="login" outline color="danger">Login</Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );

}

export default Login;