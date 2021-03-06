import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import { or } from "../lib/fp";
import { reduxForm } from "redux-form";
import { validate, synchronousValidation, warn } from "../validators/proposal";
import { withRouter } from "react-router-dom";
import { getNewProposalData } from "../lib/editors_content_backup";

const submitConnector = connect(
  sel.selectorMap({
    initialValues: or(sel.draftProposalById, getNewProposalData),
    isLoading: or(sel.isLoadingSubmit, sel.newProposalIsRequesting),
    loggedInAsEmail: sel.loggedInAsEmail,
    userCanExecuteActions: sel.userCanExecuteActions,
    policy: sel.policy,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    keyMismatch: sel.getKeyMismatch,
    name: sel.newProposalName,
    description: sel.newProposalDescription,
    files: sel.newProposalFiles,
    newProposalError: sel.newProposalError,
    merkle: sel.newProposalMerkle,
    token: sel.newProposalToken,
    signature: sel.newProposalSignature,
    proposalCredits: sel.proposalCredits,
    draftProposalById: sel.draftProposalById
  }),
  {
    onFetchData: act.onGetPolicy,
    onSave: act.onSaveNewProposal,
    onResetProposal: act.onResetProposal,
    onSaveDraft: act.onSaveDraftProposal,
    onDeleteDraft: act.onDeleteDraftProposal
  }
);

class SubmitWrapper extends Component {

  componentDidMount() {
    this.props.policy || this.props.onFetchData();
  }

  componentWillReceiveProps({ token }) {
    if (token) {
      if (this.props.draftProposalById) {
        this.props.onDeleteDraft(this.props.draftProposalById.draftId);
      }
      this.props.onResetProposal();
      return this.props.history.push("/proposals/" + token);
    }
  }

  render() {
    const Component = this.props.Component;
    return <Component {...{ ...this.props,
      onSave: this.onSave.bind(this),
      onSaveDraft: this.onSaveDraft
    }}  />;
  }

  onSave(...args) {
    validate(...args);
    return this.props.onSave(...args);
  }

  onSaveDraft = (...args) => {
    validate(...args);
    this.props.onSaveDraft(...args);
    this.props.history.push("/user/proposals/drafts");
  }
}

const wrapSubmit = (Component) => (props) => <SubmitWrapper {...{ ...props, Component }} />;

export default compose(
  withRouter,
  submitConnector,
  reduxForm({
    form: "form/proposal",
    touchOnChange: true,
    validate: synchronousValidation,
    enableReinitialize: true,
    warn
  }),
  wrapSubmit
);
