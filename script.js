/**
 * 天枢便签官网 — 交互与动画
 */

(function () {
    'use strict';

    // ─── Toast 通知函数 ───
    window.showToast = function(message) {
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.style.cssText = `
                position: fixed;
                bottom: 28px;
                right: 28px;
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                color: white;
                padding: 16px 28px;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05);
                z-index: 9999;
                transform: translateY(20px) scale(0.95);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
                display: flex;
                align-items: center;
                gap: 12px;
            `;
            
            const icon = document.createElement('span');
            icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
            toast.appendChild(icon);
            
            document.body.appendChild(toast);
        }

        toast.lastChild.textContent = message;
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0) scale(1)';
            toast.style.opacity = '1';
        });

        setTimeout(() => {
            toast.style.transform = 'translateY(20px) scale(0.95)';
            toast.style.opacity = '0';
        }, 3000);
    };

    // ─── 导航栏 ───
    const navbar = document.getElementById('navbar');
    const navMobileBtn = document.getElementById('navMobileBtn');
    const navLinks = document.getElementById('navLinks');

    // 滚动时添加阴影
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 20);
                ticking = false;
            });
            ticking = true;
        }
    });

    // 移动端菜单
    if (navMobileBtn && navLinks) {
        navMobileBtn.addEventListener('click', () => {
            navMobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMobileBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target && href.length > 1) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 16;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ─── 滚动进度条 ───
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${progress}%`;
        });
    }
    createScrollProgress();

    // ─── 粒子背景 ───
    function createParticles() {
        const container = document.createElement('div');
        container.className = 'particles-container';
        document.body.appendChild(container);

        const particleCount = 25;
        for (let i = 0; i < particleCount; i++) {
            createParticle(container);
        }

        function createParticle(container) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 8 + 3;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 15;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `-${delay}s`;
            
            container.appendChild(particle);
        }
    }
    createParticles();

    // ─── 滚动揭示动画增强版 ───
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.08
    });

    // 观察所有 reveal 元素
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate').forEach(el => {
        revealObserver.observe(el);
    });

    // ─── 数字递增动画 ───
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => statObserver.observe(el));

    function animateNumber(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1200;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * ease);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // ─── Hero 鼠标视差增强版 ───
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        const hero = document.getElementById('hero');
        let rafId = null;

        hero.addEventListener('mousemove', (e) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                const wrapper = heroVisual.querySelector('.hero-screenshot-wrapper');
                if (wrapper) {
                    wrapper.style.transform =
                        `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
                }

                const floatEl = heroVisual.querySelector('.screenshot-float-2');
                if (floatEl) {
                    floatEl.style.transform =
                        `translate(${x * 12}px, ${y * 12}px)`;
                }
            });
        });

        hero.addEventListener('mouseleave', () => {
            const wrapper = heroVisual.querySelector('.hero-screenshot-wrapper');
            if (wrapper) {
                wrapper.style.transition = 'transform 0.5s ease';
                wrapper.style.transform = 'perspective(1200px) rotateY(0) rotateX(0)';
                setTimeout(() => { wrapper.style.transition = ''; }, 500);
            }
            const floatEl = heroVisual.querySelector('.screenshot-float-2');
            if (floatEl) {
                floatEl.style.transition = 'transform 0.5s ease';
                floatEl.style.transform = '';
                setTimeout(() => { floatEl.style.transition = ''; }, 500);
            }
        });
    }

    // ─── 下载按钮交互 ───
    document.querySelectorAll('.dl-platform, .platform-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const platform = btn.dataset.platform || btn.querySelector('strong')?.textContent || '软件';
            const href = btn.getAttribute('href');

            // 如果是外部链接或者下载链接，不要阻止默认行为
            if (href && !href.startsWith('#')) {
                showToast(`正在跳转到下载页面...`);
                // 不阻止默认行为，让浏览器正常处理
            } else if (!href || href === '#') {
                e.preventDefault();
                showToast(`${platform} 版本即将推出，敬请期待！`);
            }
        });
    });

    // ─── 平台卡片粒子效果 ───
    function createParticleBurst(element, color) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                left: ${centerX}px;
                top: ${centerY}px;
                box-shadow: 0 0 10px ${color};
            `;
            
            const angle = (i / 12) * Math.PI * 2;
            const velocity = 80 + Math.random() * 60;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;
            
            document.body.appendChild(particle);
            
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    document.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            let color = 'rgba(59, 130, 246, 0.8)';
            if (card.classList.contains('platform-windows')) color = 'rgba(59, 130, 246, 0.8)';
            else if (card.classList.contains('platform-mac')) color = 'rgba(148, 163, 184, 0.8)';
            else if (card.classList.contains('platform-linux')) color = 'rgba(249, 115, 22, 0.8)';
            else if (card.classList.contains('platform-github')) color = 'rgba(129, 140, 248, 0.8)';
            
            createParticleBurst(card, color);
        });
    });

    // ─── 通知提示 ───
    function showNotification(message) {
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.style.cssText = `
                position: fixed;
                bottom: 28px;
                right: 28px;
                background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
                color: white;
                padding: 14px 24px;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                z-index: 9999;
                transform: translateY(20px);
                opacity: 0;
                transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                font-family: 'Noto Sans SC', sans-serif;
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        setTimeout(() => {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
        }, 3000);
    }

    // ─── 导航高亮当前区域 ───
    const sections = document.querySelectorAll('.section, .hero');
    const navLinkEls = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinkEls.forEach(link => {
                    const href = link.getAttribute('href');
                    link.classList.toggle('active',
                        href === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    });

    sections.forEach(section => {
        if (section.id) sectionObserver.observe(section);
    });

    // ─── 为元素添加随机动画延迟 ───
    function addStaggerDelay() {
        const featureBlocks = document.querySelectorAll('.feature-block');
        featureBlocks.forEach((block, index) => {
            block.style.transitionDelay = `${index * 0.08}s`;
        });

        const highlightCards = document.querySelectorAll('.hl-card');
        highlightCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.06}s`;
        });

        const techCards = document.querySelectorAll('.tech-card');
        techCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.05}s`;
        });
    }
    addStaggerDelay();

    // ─── 为卡片添加3D倾斜效果 ───
    function add3DCardTilt() {
        const cards = document.querySelectorAll('.hl-card, .tech-card, .ov-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                card.style.transform = `
                    perspective(1000px)
                    rotateX(${-y * 5}deg)
                    rotateY(${x * 5}deg)
                    translateY(-8px)
                    scale(1.02)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    add3DCardTilt();

    // ─── 为按钮添加涟漪效果 ───
    function addRippleEffect() {
        document.querySelectorAll('.btn, .github-btn, .dl-platform, .platform-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    left: ${x}px;
                    top: ${y}px;
                    animation: ripple-effect 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple-effect {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(3);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
    addRippleEffect();

    // ─── 页面加载动画 ───
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.6s ease';
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.body.style.opacity = '1';
            });
        });
    });

})();
