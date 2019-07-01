import React, {Component} from 'react';
import {Modal , Label} from 'semantic-ui-react';
import {connect} from 'react-redux';

import {closeModal} from "./ModalsActions";
import RegisterForm from "../auth/register/RegisterForm";



class ModalRegister extends Component {
    render() {
        return (
            <Modal
                size='mini'
                open={true}
                onClose={this.props.closeModal}
            >
                <Modal.Header>
                    <Label size='big' color='teal' content='Sign Up to Your vents!' />
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <RegisterForm />
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}


const actions = {closeModal};


export default connect(null, actions)(ModalRegister);