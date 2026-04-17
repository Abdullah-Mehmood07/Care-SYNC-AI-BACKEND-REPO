export const loginUser = (userData) => {
    // userData comes directly from the backend API response
    localStorage.setItem('caresync_user_token', userData.token);
    localStorage.setItem('caresync_user_role', userData.role);
    localStorage.setItem('caresync_user_email', userData.email);
    localStorage.setItem('caresync_user_id', userData._id); // Always store the actual DB ID
    
    // Store ID based on the user's role (GHID for patient, obj ID for admins)
    if (userData.role === 'Patient' && userData.ghid) {
        localStorage.setItem('caresync_patient_id', userData.ghid);
    } else {
        localStorage.setItem('caresync_patient_id', userData._id);
    }

    if (userData.hospitalId) {
        localStorage.setItem('caresync_hospital_id', userData.hospitalId);
    }

    if (userData.doctorId) {
        localStorage.setItem('caresync_doctor_id', userData.doctorId);
    }
};

export const logoutUser = () => {
    localStorage.removeItem('caresync_user_token');
    localStorage.removeItem('caresync_user_role');
    localStorage.removeItem('caresync_user_email');
    localStorage.removeItem('caresync_user_id');
    localStorage.removeItem('caresync_patient_id');
    localStorage.removeItem('caresync_hospital_id');
    localStorage.removeItem('caresync_doctor_id');
};

export const getUserInfo = () => {
    return {
        _id: localStorage.getItem('caresync_user_id') || null,
        id: localStorage.getItem('caresync_patient_id') || 'N/A',
        email: localStorage.getItem('caresync_user_email') || '',
        role: localStorage.getItem('caresync_user_role') || '',
        token: localStorage.getItem('caresync_user_token') || null,
        hospitalId: localStorage.getItem('caresync_hospital_id') || null,
        doctorId: localStorage.getItem('caresync_doctor_id') || null
    };
};

export const isLoggedIn = () => {
    return !!localStorage.getItem('caresync_user_token');
};
