export const DIRECT_TYPES = [
    {
        text: 'OKTA',
        value: 'OKTA'
    },
    {
        text: 'Oracle IDCS',
        value: 'IDCS'
    },
    {
        text: 'LDAP',
        value: 'LDAP'
    },
    {
        text: 'Active Directory',
        value: 'AD'
    },
    {
        text: 'AWS',
        value: 'AWS'
    }
];

export const getDueColor = (dueDays) => {
  let dueColor = '#1890ff';
  if (dueDays > 5 && dueDays <= 10) {
    dueColor = '#e2e271'
  } else if (dueDays < 5) {
    dueColor = '#dc3545'
  }
  return dueColor;
}

export const getOrphanFlags = (profile) => {
    if(!profile){return {}}
    const object = {}
    if(profile.federated === "No" && profile.is_mfa_activated === "FALSE"){
        object.isMFADisabled = true;
    }
    if(profile.isLinkedAccount === "NO"){
        object.isOrphanAccount = true;
    }
    return object
}
