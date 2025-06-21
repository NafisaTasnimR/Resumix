import React from 'react';
import './ColorPaletteModal.css';

const colors = ["#A464DC", "#9554D1", "#8648C6", "#7540B6", "#6337A6"];

const ColorPaletteModal = ({ onClose, onColorSelect }) => {
    return (
        <div className="color-palette-modal-overlay">
            <div className="color-popup">
                <div className="color-popup-header">
                    <h2>Color Palette</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="color-swatch-container">
                    {colors.map(color => (
                        <button
                            key={color}
                            className="color-swatch"
                            style={{ backgroundColor: color }}
                            onClick={() => onColorSelect && onColorSelect(color)}
                            data-color={color}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
export default ColorPaletteModal;