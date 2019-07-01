import React, {Component} from 'react';
import { Modal , Label } from 'semantic-ui-react';
import {connect} from 'react-redux';

import LoginForm from '../auth/login/LoginForm';
import { closeModal } from "./ModalsActions";



class ModalLogin extends Component {
    handleCloseModal = () => {
        
    }
    render() {
        return (
            <Modal
                size='mini'
                open={true}
                onClose={this.props.closeModal}
            >
                <Modal.Header>
                    <Label size='big' color='teal' content='Login to Your vents!' />
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <LoginForm />
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}


const actions = {closeModal};

export default connect(null, actions)(ModalLogin);