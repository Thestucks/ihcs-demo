import React from 'react';
import '../styles/BankScene.css';

export default function BankScene() {
    return (
        <div className="bank-scene">
            {/* Floating Credit Card - Pure CSS 3D */}
            <div className="card-wrapper">
                <div className="credit-card">
                    <div className="card-front">
                        <div className="card-chip"></div>
                        <div className="card-number">•••• •••• •••• 9000</div>
                        <div className="card-details">
                            <span className="card-holder">IHCS MEMBER</span>
                            <span className="card-expiry">12/28</span>
                        </div>
                        <div className="card-brand">NEXUS</div>
                    </div>
                </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="floating-element sphere sphere-1"></div>
            <div className="floating-element sphere sphere-2"></div>
            <div className="floating-element cube cube-1"></div>
            <div className="floating-element ring ring-1"></div>

            {/* Gradient Glow Effects */}
            <div className="glow-effect glow-1"></div>
            <div className="glow-effect glow-2"></div>
        </div>
    );
}
