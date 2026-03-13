export const loginUser = (role, email) => {
    if (role === 'patient') {
        let patientID = localStorage.getItem('caresync_patient_id');
        if (!patientID) {
            patientID = 'MR-' + Math.floor(100000 + Math.random() * 900000);
            localStorage.setItem('caresync_patient_id', patientID);
        }
        localStorage.setItem('caresync_user_name', 'Mr. Ahmed Ali');
    } else if (role === 'pa') {
        localStorage.setItem('caresync_user_name', 'PA Saima Khan');
        localStorage.setItem('caresync_patient_id', 'PA-' + Math.floor(1000 + Math.random() * 9000));
    } else if (role === 'lab') {
        localStorage.setItem('caresync_user_name', 'Lab Specialist');
    } else if (role === 'hospital') {
        localStorage.setItem('caresync_user_name', 'Hospital Admin');
    }

    localStorage.setItem('caresync_user_token', 'true');
    localStorage.setItem('caresync_user_role', role);
    localStorage.setItem('caresync_user_email', email || 'user@caresync.ai');
};

export const logoutUser = () => {
    localStorage.removeItem('caresync_user_token');
    localStorage.removeItem('caresync_user_role');
};

export const getUserInfo = () => {
    return {
        id: localStorage.getItem('caresync_patient_id') || 'N/A',
        name: localStorage.getItem('caresync_user_name') || 'Guest',
        email: localStorage.getItem('caresync_user_email') || '',
        role: localStorage.getItem('caresync_user_role') || ''
    };
};

export const isLoggedIn = () => {
    return !!localStorage.getItem('caresync_user_token');
};
