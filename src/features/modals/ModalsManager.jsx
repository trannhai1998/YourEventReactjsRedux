import React from 'react'
import { connect } from 'react-redux';
import ModalLogin from './ModalLogin';
import ModalRegister from './ModalRegister';
import UnAuthModal from './UnAuthModal'

const modalLookup = {
    ModalLogin,
    ModalRegister,
    UnAuthModal
}
const mapState = (state) => ({
  currentModal : state.modals
})
const ModalsManager = ({currentModal}) => {
  let renderedModal;
  if (currentModal) {
    const {modalType , modalProps } = currentModal;
    const ModalComponent = modalLookup[modalType];

    renderedModal = <ModalComponent {...modalProps} />
  }
  return (
        <span>{renderedModal}</span>
  )
}




export default connect(mapState)(ModalsManager);
