import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import {createProfile} from '../../actions/profileActions'

class CreateProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            displaySocialInputs: false,
            handle: '',
            company: '',
            website: '',
            location: '',
            status: '',
            skills: '',
            githubusername: '',
            bio: '',
            twitter: '',
            facebook: '',
            linkedin: '',
            youtube: '',
            instagram: '',
            errors: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({errors: nextProps.errors})
        }
    }
    onSubmit = (e) => {
        e.preventDefault();

        const profileData = {
            handle: this.state.handle,
            company: this.state.company,
            website: this.state.website,
            location: this.state.location,
            status: this.state.status,
            skills: this.state.skills,
            githubusername: this.state.githubusername,
            bio: this.state.bio,
            twitter: this.state.twitter,
            facebook: this.state.facebook,
            linkedin: this.state.linkedin,
            youtube: this.state.youtube,
            instagram: this.state.instagram,
        }

        this.props.createProfile(profileData, this.props.history);
    }
    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
  render() {
      const { errors, displaySocialInputs } = this.state;

      let socialInputs;

      if (displaySocialInputs) {
          socialInputs = (
              <div>
                  <InputGroup 
                  placeholder="Twitter - Link do perfil"
                  name="twitter"
                  icon="fab fa-twitter"
                  value={this.state.twitter}
                  onChange={this.onChange}
                  error={errors.twitter}
                  />
                    
                  <InputGroup 
                  placeholder="facebook - Link do perfil"
                  name="facebook"
                  icon="fab fa-facebook"
                  value={this.state.facebook}
                  onChange={this.onChange}
                  error={errors.facebook}
                  />
                  <InputGroup 
                  placeholder="instagram - Link do perfil"
                  name="instagram"
                  icon="fab fa-instagram"
                  value={this.state.instagram}
                  onChange={this.onChange}
                  error={errors.instagram}
                  />
                <InputGroup 
                  placeholder="linkedin - Link do perfil"
                  name="linkedin"
                  icon="fab fa-linkedin"
                  value={this.state.linkedin}
                  onChange={this.onChange}
                  error={errors.linkedin}
                  />
                   <InputGroup 
                  placeholder="youtube - Link do perfil"
                  name="youtube"
                  icon="fab fa-youtube"
                  value={this.state.youtube}
                  onChange={this.onChange}
                  error={errors.youtube}
                  />
              </div>
          )
      }
      //options for form
      const options = [
          {label: '* Select professional status', value: 0},
          {label: 'Developer', value: 'Developer'},
          {label: 'Junior Developer', value: 'Junior Developer'},
          {label: 'Senior Developer', value: 'Senior Developer'},
          {label: 'Manager', value: 'Manager'},
          {label: 'Student or Learning', value: 'Student or Learning'},
          {label: 'Instructor or Teacher', value: 'Instructor or Teacher'},
          {label: 'Inthern', value: 'Inthern'}
      ];
    return (
      <div className="create-profile">
        <div className="container">
            <div className="row">
                <div className="col-md-8 m-auto">
                    <h1 className="display-4 text-center"> Crie seu perfil!</h1>
                    <p className="lead text-center">Crie seu perfil com algumas informações para se destacar </p>
                    <small className="d-block pb-3">* = required fields</small>
                    <form onSubmit={this.onSubmit}>
                        <TextFieldGroup
                        placeholder="* Nome do perfil"
                        name="handle"
                        value={this.state.handle}
                        onChange={this.onChange}
                        error={errors.handle}
                        info="Um nome unico"
                        />

                        <SelectListGroup 
                        placeholder="Status"
                        name="status"
                        options = {options}
                        value={this.state.status}
                        onChange={this.onChange}
                        error={errors.status}
                        info="Give us an idea of where you are at in your carrear"
                        />
                        <TextFieldGroup
                        placeholder="Empresa"
                        name="company"
                        value={this.state.company}
                        onChange={this.onChange}
                        error={errors.company}
                        info="Empresa que está trabalhando"
                        />
                        <TextFieldGroup
                        placeholder="Site"
                        name="website"
                        value={this.state.website}
                        onChange={this.onChange}
                        error={errors.website}
                        info="Site"
                        />
                        <TextFieldGroup
                        placeholder="Localização"
                        name="location"
                        value={this.state.location}
                        onChange={this.onChange}
                        error={errors.location}
                        info="Um nome unico"
                        />
                        <TextFieldGroup
                        placeholder="* Habilidades"
                        name="skills"
                        value={this.state.skills}
                        onChange={this.onChange}
                        error={errors.skills}
                        info="Adicione suas habilidades separadas por virgula EX: html,css, javascript, etc"
                        />
                        <TextFieldGroup
                        placeholder="Github User Name"
                        name="githubusername"
                        value={this.state.githubusername}
                        onChange={this.onChange}
                        error={errors.githubusername}
                        info="Se você tem uma conta no Github você pode inserir ela aqui."
                        />
                        <TextAreaFieldGroup
                        placeholder="Biografia"
                        name="bio"
                        value={this.state.bio}
                        onChange={this.onChange}
                        error={errors.bio}
                        info="Conte-nos sobre você!"
                        /> 

                        <div className="mb-3">
                            <button onClick={() => {
                                this.setState(prevState => ({
                                    displaySocialInputs: !prevState.displaySocialInputs
                                }))
                            }} className="btn btn-light">
                            Redes Sociais
                            </button>
                            <span className="text-muted">Opicional</span>
                        </div>
                        {socialInputs}         
                        <input type="submit" value="Submit" className="btn btn-info btn-block mt-4"></input>              
                        
                    </form>
                </div>
            </div>
        </div>
      </div>
    )
  }
}


CreateProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
})

export default connect(mapStateToProps, { createProfile })(withRouter(CreateProfile));