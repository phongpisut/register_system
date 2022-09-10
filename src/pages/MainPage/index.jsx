import { useState, Suspense } from "react";
import {
  Content,
  Container,
  Grid,
  Row,
  Col,
  Progress,
  IconButton,
} from "rsuite";
import { RegisterForm, LoginForm } from "~/components";
import ParticipantTable from "./components/ParticipantTable";

export default function LoginPages() {
  return (
    <div className="bg-gradient-to-t from-blue-600 to-sky-700  w-screen h-screen place-content-center items-center flex">
      <div className="absolute top-0 right-0 m-5 animate-pulse ">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
      <Container>
        <Content>
          <Grid fluid>
            <Row className="show-grid place-content-center items-center flex">
              <Col xs={20} sm={20} md={15} lg={15} xl={15}>
                <Row className="grid justify-items-end my-1">
                  <div className="drop-shadow-md rounded bg-white w-1/5 bg-gradient-to-r from-blue-800 to-cyan-400 w-36">
                    <div className="place-content-center items-center flex h-full">
                      <p className="text-white text-center text-base font-IBM py-1">
                        / 10 ที่นั่ง
                      </p>
                    </div>
                  </div>
                  <Progress.Line
                    percent={80}
                    showInfo={false}
                    className="w-36 my-0 py-1"
                  />
                </Row>
                <Row>
                  <div className="drop-shadow-md rounded bg-white w-full h-full p-2">
                    <ParticipantTable />
                    <Suspense>
                      <RegisterForm />
                    </Suspense>
                  </div>
                </Row>
              </Col>
            </Row>
          </Grid>
        </Content>
      </Container>
    </div>
  );
}
