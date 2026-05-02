// ===== AutoCode.AI Web App - JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // ===== Navbar Scroll Effect =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== Smooth Scroll for Nav Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Mobile Menu Toggle =====
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // ===== Copy to Clipboard =====
    const copyBtn = document.getElementById('copy-btn');
    const installCommand = document.querySelector('.install-command code');

    if (copyBtn && installCommand) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(installCommand.textContent.trim());
                copyBtn.classList.add('copied');
                copyBtn.querySelector('span').textContent = 'Copied!';

                // Change icon to checkmark
                copyBtn.querySelector('svg').innerHTML = `
                    <polyline points="20 6 9 17 4 12" stroke-width="2" fill="none"/>
                `;

                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.querySelector('span').textContent = 'Copy';
                    copyBtn.querySelector('svg').innerHTML = `
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    `;
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = installCommand.textContent.trim();
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                copyBtn.classList.add('copied');
                copyBtn.querySelector('span').textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.querySelector('span').textContent = 'Copy';
                }, 2000);
            }
        });
    }

    // ===== Scroll Reveal Animation =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and elements
    document.querySelectorAll('.feature-card, .step-card, .download-option, .setup-step').forEach(el => {
        observer.observe(el);
    });

    // ===== Setup Section Copy Buttons =====
    document.querySelectorAll('.setup-copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.dataset.copy;
            try {
                await navigator.clipboard.writeText(textToCopy);
            } catch {
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            btn.classList.add('copied');
            btn.querySelector('span').textContent = 'Copied!';
            btn.querySelector('svg').innerHTML = `<polyline points="20 6 9 17 4 12" stroke-width="2" fill="none"/>`;
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.querySelector('span').textContent = 'Copy';
                btn.querySelector('svg').innerHTML = `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`;
            }, 2000);
        });
    });

    // ===== Animated Counter =====
    const animateCounter = (element, target, duration = 1200) => {
        const start = 0;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (target - start) * easeOut);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    // Observe stat numbers
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statObserver.observe(el));

    // ===== Fetch Live Install Count from VS Code Marketplace =====
    const fetchInstallCount = async () => {
        try {
            const response = await fetch('https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json;api-version=3.0-preview.1'
                },
                body: JSON.stringify({
                    filters: [{
                        criteria: [{ filterType: 7, value: 'anupthakur.autocode-ai-anup' }]
                    }],
                    flags: 914
                })
            });

            if (response.ok) {
                const data = await response.json();
                const extension = data?.results?.[0]?.extensions?.[0];
                if (extension && extension.statistics) {
                    const installStat = extension.statistics.find(stat => stat.statisticName === 'install');
                    if (installStat && installStat.value) {
                        const installElements = document.querySelectorAll('.stat-number');
                        installElements.forEach(el => {
                            if (el.nextElementSibling && el.nextElementSibling.textContent.includes('Installs')) {
                                el.dataset.target = installStat.value;
                                // Automatically trigger animation to new value
                                animateCounter(el, installStat.value);
                            }
                        });
                    }
                }
            }
        } catch (e) {
            console.error('Error fetching install count:', e);
        }
    };

    // Fetch immediately
    fetchInstallCount();

    // ===== Tilt Effect on Feature Cards =====
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===== Particle Effect Around Hero Image =====
    const heroWrapper = document.querySelector('.hero-image-wrapper');
    if (heroWrapper) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${3 + Math.random() * 4}px;
                height: ${3 + Math.random() * 4}px;
                background: ${Math.random() > 0.5 ? '#6366f1' : '#a855f7'};
                border-radius: 50%;
                opacity: ${0.3 + Math.random() * 0.4};
                z-index: 2;
                pointer-events: none;
                animation: particle-orbit ${5 + Math.random() * 5}s linear infinite;
                animation-delay: ${-Math.random() * 10}s;
            `;

            const angle = (360 / 6) * i;
            particle.style.setProperty('--start-angle', `${angle}deg`);
            heroWrapper.appendChild(particle);
        }

        // Inject particle animation
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes particle-orbit {
                    0% {
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(var(--start-angle, 0deg)) translateX(180px) scale(1);
                        opacity: 0.6;
                    }
                    50% {
                        opacity: 0.2;
                        transform: translate(-50%, -50%) rotate(calc(var(--start-angle, 0deg) + 180deg)) translateX(200px) scale(0.5);
                    }
                    100% {
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(calc(var(--start-angle, 0deg) + 360deg)) translateX(180px) scale(1);
                        opacity: 0.6;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===== VSIX Download Button Handler =====
    const vsixBtn = document.getElementById('vsix-download-btn');
    if (vsixBtn) {
        vsixBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Redirect to VS Code Marketplace download
            window.open(
                'https://marketplace.visualstudio.com/items?itemName=anupthakur.autocode-ai-anup',
                '_blank'
            );
        });
    }

    // ===== Keyboard Navigation Enhancement =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navLinks?.classList.remove('active');
            mobileToggle?.classList.remove('active');
        }
    });
});
