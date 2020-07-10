import { SIGN_OUT_USER } from "./AuthContants";
import { SubmissionError, reset } from "redux-form";
import { closeModal } from "../modals/ModalsActions";
import { toastr } from "react-redux-toastr";

export const login = (creds) => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(creds.email, creds.password);
      dispatch(closeModal());
    } catch (error) {
      throw new SubmissionError({
        _error: "Your Email or Password is Wrong ! ",
      });
    }
  };
};

export const logout = () => {
  return {
    type: SIGN_OUT_USER,
  };
};

export const registerUser = (user) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    try {
      //create
      let createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password);
      //update the profile
      await createdUser.updateProfile({
        displayName: user.displayName,
      });
      //create new profile
      let newUser = {
        displayName: user.displayName,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      await firestore.set(`users/${createdUser.uid}`, { ...newUser });
      dispatch(closeModal());
    } catch (error) {
      if (error && error.message === "The email address is badly formatted.") {
        error.message = "Email bạn nhập không phù hợp ";
      }
      if (
        error &&
        error.message ===
          "The email address is already in use by another account."
      ) {
        error.message = "Email bạn nhập Đã Được Đăng Ký";
      }

      if (
        error &&
        error.message === "Password should be at least 6 characters"
      ) {
        error.message = "Password phải lớn hơn hoặc bằng 6 ký tự ";
      }
      throw new SubmissionError({
        _error: error.message,
      });
    }
  };
};
export const socialLogin = (selectedProvider) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  try {
    dispatch(closeModal());
    const user = await firebase.login({
      provider: selectedProvider,
      type: "popup",
    });
    if (user.additionalUserInfo.isNewUser) {
      await firebase.set(`users/${user.user.uid}`, {
        displayName: user.profile.displayName,
        photoURL: user.profile.avatarUrl,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {}
};

export const updatePassword = (creds) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  try {
    await user.updatePassword(creds.newPassword1);
    await dispatch(reset("account"));
    toastr.success("Success ^^ ", " Your password has been update");
  } catch (error) {
    throw new SubmissionError({
      _error: error.message,
    });
  }
};
