/**
 * 天枢便签官网 — 交互与动画
 */

(function () {
    'use strict';

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
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 16;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ─── 滚动揭示动画 ───
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.08
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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
            // ease-out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * ease);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // ─── Hero 鼠标视差 ───
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
    document.querySelectorAll('.dl-platform').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.dataset.platform;
            showNotification(`正在准备 ${platform} 版本下载...`);
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

    // ─── 页面加载 ───
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.4s ease';
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });

})();
