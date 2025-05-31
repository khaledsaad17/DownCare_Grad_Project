// API endpoint for doctors data
const DOCTORS_API = 'http://downcare.runasp.net/api/User/Doctors';

// Page elements
const elements = {
    loading: document.getElementById('loading'),
    error: document.getElementById('error-message'),
    container: document.getElementById('doctors-container'),
    search: document.getElementById('doctor-search')
};

// Fetch doctors data
async function getDoctors() {
    try {
        showLoading(true);
        const response = await fetch(DOCTORS_API);
        if (!response.ok) throw new Error('Failed to load doctors data. Please try again later.');
        const doctors = await response.json();
        displayDoctors(doctors);
        setupSearch(doctors);
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Display doctors with optional filtering
function displayDoctors(doctors, filteredDoctors = null) {
    const doctorsToShow = filteredDoctors || doctors;
    
    if (!doctorsToShow || doctorsToShow.length === 0) {
        elements.container.innerHTML = noDoctorsMessage();
        return;
    }
    
    elements.container.innerHTML = doctorsToShow.map(doctor => createDoctorCard(doctor)).join('');
}

// Setup search functionality
function setupSearch(doctors) {
    elements.search.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const filteredDoctors = doctors.filter(doctor => {
            const nameMatch = doctor.name?.toLowerCase().includes(searchTerm);
            const locationMatch = doctor.governate?.toLowerCase().includes(searchTerm);
            const specialtyMatch = doctor.specialization?.toLowerCase().includes(searchTerm);
            return nameMatch || locationMatch || specialtyMatch;
        });
        displayDoctors(doctors, filteredDoctors);
    });
}

// Create doctor card HTML with 3D flip effect
function createDoctorCard(doctor) {
    const defaultImage = 'img/default-article.jpg';
    let doctorImage = doctor.imagePath 
        ? `http://downcare.runasp.net/${doctor.imagePath}` 
        : defaultImage;

    // Validate image URL
    if (!isValidImageUrl(doctorImage)) {
        doctorImage = defaultImage;
    }

    return `
        <div class="doctor-card">
            <div class="doctor-card-inner">
                <div class="doctor-card-front">
                    <div class="doctor-img-container">
                        <img src="${doctorImage}" alt="${doctor.name}" 
                            onerror="this.src='${defaultImage}'" class="doctor-img">
                    </div>
                    <div class="doctor-info">
                        <h3 class="doctor-name">DR.${doctor.name || 'Doctor'}</h3>
                        <span class="doctor-specialty">${doctor.specialization || 'Specialty not specified'}</span>
                        <p class="doctor-bio">
                            <i class="fas fa-map-marker-alt"></i> ${doctor.governate || 'Location not available'}
                        </p>
                        <p class="doctor-bio">
                            <i class="fas fa-phone"></i> ${doctor.phone || 'Not available'}
                        </p>
                    </div>
                </div>
                <div class="doctor-card-back">
                    <h3>Contact This Doctor</h3>
                    <p>To contact DR.${doctor.name || 'this doctor'}, please download our application for direct communication.</p>
                    <div class="app-buttons">
                        <button class="download-btn">
                            <i class="fas fa-download"></i> Download Now
                        </button>
                        <a href="About DownCare.html" class="details-btn">
                            <i class="fas fa-info-circle"></i> App Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Validate image URL
function isValidImageUrl(url) {
    try {
        new URL(url);
        return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
    } catch {
        return false;
    }
}

// No doctors message
function noDoctorsMessage() {
    return `
        <div class="no-doctors">
            <i class="fas fa-user-md"></i>
            <h3>No Doctors Available</h3>
            <p>We couldn't find any doctors matching your search. Please try different keywords.</p>
        </div>
    `;
}

// Helper functions
function showLoading(show) {
    elements.loading.style.display = show ? 'flex' : 'none';
    if (show) {
        elements.container.innerHTML = '';
    }
}

function showError(message) {
    elements.error.textContent = message;
    elements.error.style.display = 'block';
    setTimeout(() => {
        elements.error.style.display = 'none';
    }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', getDoctors);