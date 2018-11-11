import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions'
import Spinner from '../common/Spinner'

class Dashboard extends Component {

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {

    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;
    
    if (profile === null || loading) {
        dashboardContent = <Spinner />
    } else {
        if (Object.keys(profile).length > 0) {
          dashboardContent = <h4>DISPLAY profile</h4>
        } else {
          //USER DONT HAVE PROFILE 
          dashboardContent = (
            <div>
              <p className="lead text-muted"> Bem vindo {user.name} !</p>
              <p>Você ainda não criou um perfil, por favor cadastre algumas informações</p>
              <Link to="/create-profile" className="btn btn-lg btn-info"> Crie um perfil!</Link>
            </div>
          )
        }
     }

    return (
      <div className="dashboard">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="display-4">Dashboard</h1>
                {dashboardContent}
              </div>
            </div>
          </div>
      </div>
    )
  }
}

Dashboard.protoTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
})


export default connect(mapStateToProps, { getCurrentProfile }) (Dashboard);