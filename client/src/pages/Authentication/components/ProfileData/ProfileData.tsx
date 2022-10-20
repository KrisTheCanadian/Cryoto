import React from 'react';

/**
 * Renders information about the user obtained from Microsoft Graph
 */
function ProfileData(props: any) {
  const name = 'Name: ';
  const email = 'Email: ';
  const id = 'Id: ';
  const workerID = 'WorkerID: ';
  const company = 'Company: ';
  const supervisoryOrganization = 'Department: ';
  const managerReference = 'Manager: ';
  const businessTitle = 'BusinessTitle: ';
  const countryReference = 'CountryReference: ';
  const mobile = 'Phone Number: ';
  const fax = 'Fax: ';
  const localReference = 'Language: ';

  return (
    <div id="profile-div">
      <p>
        <strong>{name} </strong> {props.userProfileData.userProfile.name}
      </p>
      <p>
        <strong>{email} </strong> {props.userProfileData.userProfile.email}
      </p>
      <p>
        <strong>{id} </strong> {props.userProfileData.userProfile.oId}
      </p>
      <p>
        <strong>{workerID} </strong> {props.userProfileData.workerID}
      </p>
      <p>
        <strong>{company} </strong> {props.userProfileData.company}
      </p>
      <p>
        <strong>{supervisoryOrganization} </strong>{' '}
        {props.userProfileData.supervisoryOrganization}
      </p>
      <p>
        <strong>{managerReference} </strong>{' '}
        {props.userProfileData.managerReference}
      </p>
      <p>
        <strong>{businessTitle} </strong> {props.userProfileData.businessTitle}
      </p>
      <p>
        <strong>{countryReference} </strong>{' '}
        {props.userProfileData.countryReference}
      </p>
      <p>
        <strong>{mobile} </strong> {props.userProfileData.mobile}
      </p>
      <p>
        <strong>{fax} </strong> {props.userProfileData.fax}
      </p>
      <p>
        <strong>{localReference} </strong>{' '}
        {props.userProfileData.localReference}
      </p>
    </div>
  );
}
export default ProfileData;
