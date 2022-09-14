import { Content, Container, Grid, Row, Col, Header } from "rsuite";
import { RegisterForm, LoginForm } from "~/components";
import PlusRoundIcon from "@rsuite/icons/PlusRound";

import { useDataContext } from "~/utils";

import ParticipantTable from "./components/ParticipantTable";
import RemainingSeat from "./components/RemainingSeat";

export default function LoginPages() {
  const {
    userData,
    max,
    remaining,
    count,
    isAdmin,
    login,
    updateMaximum,
    editSeat,
    acquiredSeat,
    openSeat,
    addData,
  } = useDataContext();

  return (
    <div className="bg-gradient-to-t from-blue-600 to-sky-700  w-screen h-screen pt-20 flex">
      <div className="absolute top-0 right-0 m-5 animate-pulse ">
        <LoginForm onSubmit={login} isAdmin={isAdmin} />
      </div>
      <Container>
        <Header>
          <h1 className="text-center font-IBM text-slate-50 text-2xl sm:text-4xl">
            ลงทะเบียนเข้าร่วมงาน
          </h1>

          <h3 className="text-center font-IBM text-slate-50 text-base mb-10 underline decoration-sky-500">
            กดปุ่ม <PlusRoundIcon /> เพื่อลงทะเบียน
          </h3>
        </Header>

        <Content>
          <Grid fluid>
            <Row className="show-grid place-content-center items-center flex">
              <Col xs={20} sm={20} md={15} lg={15} xl={15}>
                <div className="flex justify-between mb-1 items-center">
                  <RegisterForm
                    remaining={remaining}
                    addData={addData}
                    openSeat={openSeat}
                  />

                  <RemainingSeat
                    max={max}
                    remaining={remaining}
                    count={count}
                    isAdmin={isAdmin}
                    onChangeMax={updateMaximum}
                  />
                </div>

                <Row>
                  <div className="drop-shadow-md rounded bg-white w-full h-full p-2">
                    <ParticipantTable
                      userData={userData}
                      isAdmin={isAdmin}
                      acquiredSeat={acquiredSeat}
                      max={max}
                      editSeat={editSeat}
                    />
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
