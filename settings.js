// Default fields configuration
const defaultFields = [
    { id: 'movieTitle', label: 'Movie Title', type: 'text', required: true },
    { id: 'dateWatched', label: 'Date Watched', type: 'datetime-local', required: false }
];

// Field types available for custom fields
const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'datetime-local', label: 'Date & Time' },
    { value: 'select', label: 'Dropdown' }
];

// Initialize settings page
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    setupEventListeners();
});

// Load settings from storage
async function loadSettings() {
    try {
        const result = await chrome.storage.local.get(['customFields', 'fieldSettings']);
        const customFields = result.customFields || [];
        const fieldSettings = result.fieldSettings || {};

        // Populate default fields
        populateDefaultFields(fieldSettings);

        // Populate custom fields
        populateCustomFields(customFields);
    } catch (error) {
        console.error('Error loading settings:', error);
        showNotification('Error loading settings', 'error');
    }
}

// Populate default fields list
function populateDefaultFields(fieldSettings) {
    const container = document.getElementById('defaultFieldsList');
    container.innerHTML = '';

    defaultFields.forEach(field => {
        const isEnabled = fieldSettings[field.id] !== false; // Default to enabled
        const fieldItem = createDefaultFieldItem(field, isEnabled);
        container.appendChild(fieldItem);
    });
}

// Create a default field item
function createDefaultFieldItem(field, isEnabled) {
    const div = document.createElement('div');
    div.className = 'field-item';
    div.dataset.fieldId = field.id;

    div.innerHTML = `
    <span class="field-label">${field.label}</span>
    ${field.required ? '<span class="default-badge">Required</span>' : ''}
    <div style="flex: 1"></div>
    <div class="toggle-switch ${isEnabled ? 'active' : ''}" data-field-id="${field.id}"></div>
  `;

    // Add toggle functionality
    const toggle = div.querySelector('.toggle-switch');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
    });

    // Disable toggle for required fields
    if (field.required) {
        toggle.style.opacity = '0.5';
        toggle.style.cursor = 'not-allowed';
        toggle.classList.add('active');
    }

    return div;
}

// Populate custom fields list
function populateCustomFields(customFields) {
    const container = document.getElementById('customFieldsList');
    container.innerHTML = '';

    customFields.forEach((field, index) => {
        const fieldItem = createCustomFieldItem(field, index);
        container.appendChild(fieldItem);
    });
}

// Create a custom field item
function createCustomFieldItem(field, index) {
    const div = document.createElement('div');
    div.className = 'field-item';
    div.dataset.fieldIndex = index;
    div.dataset.fieldId = field.id || ''; // Store the field ID

    const typeOptions = fieldTypes.map(type =>
        `<option value="${type.value}" ${field.type === type.value ? 'selected' : ''}>${type.label}</option>`
    ).join('');

    div.innerHTML = `
    <input type="text" placeholder="Field Label" value="${field.label || ''}" class="field-label-input">
    <select class="field-type-select">
      ${typeOptions}
    </select>
    ${field.type === 'select' ? `
      <input type="text" placeholder="Options (comma-separated)" value="${field.options ? field.options.join(', ') : ''}" class="field-options-input">
    ` : ''}
    <button class="delete-btn">Delete</button>
  `;

    // Add delete functionality
    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        div.remove();
    });

    // Add type change listener to show/hide options input
    const typeSelect = div.querySelector('.field-type-select');
    typeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'select') {
            if (!div.querySelector('.field-options-input')) {
                const optionsInput = document.createElement('input');
                optionsInput.type = 'text';
                optionsInput.placeholder = 'Options (comma-separated)';
                optionsInput.className = 'field-options-input';
                div.insertBefore(optionsInput, deleteBtn);
            }
        } else {
            const optionsInput = div.querySelector('.field-options-input');
            if (optionsInput) {
                optionsInput.remove();
            }
        }
    });

    return div;
}

// Setup event listeners
function setupEventListeners() {
    // Add custom field button
    document.getElementById('addCustomFieldBtn').addEventListener('click', addCustomField);

    // Save settings button
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
}

// Add a new custom field
function addCustomField() {
    const container = document.getElementById('customFieldsList');
    const newField = {
        label: '',
        type: 'text'
    };
    const fieldItem = createCustomFieldItem(newField, container.children.length);
    container.appendChild(fieldItem);

    // Focus on the label input
    fieldItem.querySelector('.field-label-input').focus();
}

// Save settings
async function saveSettings() {
    try {
        // Collect field settings for default fields
        const fieldSettings = {};
        document.querySelectorAll('#defaultFieldsList .field-item').forEach(item => {
            const fieldId = item.dataset.fieldId;
            const toggle = item.querySelector('.toggle-switch');
            const isEnabled = toggle.classList.contains('active');
            fieldSettings[fieldId] = isEnabled;
        });

        // Collect custom fields
        const customFields = [];
        document.querySelectorAll('#customFieldsList .field-item').forEach(item => {
            const labelInput = item.querySelector('.field-label-input');
            const typeSelect = item.querySelector('.field-type-select');
            const optionsInput = item.querySelector('.field-options-input');

            const label = labelInput.value.trim();
            if (label) {
                // Use existing ID if available, otherwise generate a new one
                const existingId = item.dataset.fieldId;
                const field = {
                    id: existingId || `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    label: label,
                    type: typeSelect.value
                };

                if (optionsInput && typeSelect.value === 'select') {
                    field.options = optionsInput.value.split(',').map(opt => opt.trim()).filter(opt => opt);
                }

                customFields.push(field);
            }
        });

        // Save to storage
        await chrome.storage.local.set({ customFields, fieldSettings });

        showNotification('Settings saved successfully!', 'success');

        // Redirect back to popup after a short delay
        setTimeout(() => {
            window.location.href = 'popup.html';
        }, 1000);
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Error saving settings', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#8B5CF6'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    animation: slideInRight 0.3s ease;
  `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
