import React, {Component} from 'react';
import MainWrapper from "../App/MainWrapper";

class Logout extends Component {
  
  render() {
    return (
      <MainWrapper>
        <main>
          <div className="account">
            <div className="account__wrapper">
              <div className="account__card">
                <div className="account__head">
                  <h3 className="account__title"><span className="account__logo"> Kapstone
                                    <span className="account__logo-accent">IGA</span>
                                  </span>
                  </h3>
                </div>
                <div className="form">
                  <h3>You are successfully Logged out!</h3>
                </div>
              </div>
            </div>
          </div>
        </main>
      </MainWrapper>
    )
  }
}

export default Logout;

