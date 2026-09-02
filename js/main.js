(function () {

	var translations = {
		vi: {
			site: { name: "Shine Tu" },
			nav: { home: "Trang chủ", portfolio: "Portfolio", blog: "Blog", about: "Giới thiệu", contact: "Liên hệ" },
			lang: { groupLabel: "Chọn ngôn ngữ" },
			menu: { toggleLabel: "Mở menu" },
			footer: {
				copyright: "© 2026 Shine Tu",
				themeCredit: "Thiết kế dựa trên theme <a href=\"https://andersnoren.se/themes/bjork/\" target=\"_blank\" rel=\"noopener\">Björk</a> của Anders Norén"
			},
			home: {
				pageTitle: "Trang chủ — Shine Tu",
				hero: {
					kicker: "Xin chào!",
					title: "Tôi là Shine Tu — Art Director / Senior Creative Designer.",
					desc: "Trong một thế giới đầy ồn ào, hãy để thiết kế của bạn được lắng nghe. Đây là góc nhỏ trên internet nơi tôi lưu lại những dự án, bài viết và câu chuyện của mình.",
					btnContact: "Liên hệ với tôi",
					btnAbout: "Giới thiệu về tôi"
				},
				intro: {
					p1: "Từ những dự án tự do đầu tiên năm 2017 đến vai trò Brand & Creative Lead tại FireGroup hôm nay, tôi làm việc từ ý tưởng đầu tiên đến hệ thống hình ảnh hoàn chỉnh — luôn bắt đầu từ câu chuyện thật đằng sau mỗi thương hiệu.",
					p2: "Ngoài công việc, tôi thích thử nghiệm những ý tưởng nhỏ, viết lại quá trình học hỏi của mình và chia sẻ chúng trên blog cá nhân."
				},
				card1: { title: "Xem portfolio", desc: "Khám phá những dự án tôi đã thực hiện và các kỹ năng tôi đã trau dồi.", btn: "Xem thêm" },
				card2: { title: "Kết nối với tôi", desc: "Muốn hợp tác hoặc trò chuyện về một dự án mới? Gửi cho tôi một tin nhắn.", btn: "Liên hệ" },
				card3: { title: "Theo dõi hành trình", desc: "Đọc những bài viết mới nhất của tôi về thiết kế, sáng tạo và cuộc sống.", btn: "Đọc blog" },
				clients: {
					title: "Đã đồng hành cùng",
					item1: "L'Oréal", item2: "Nestlé", item3: "Toshiba", item4: "Vichy",
					item5: "La Roche-Posay", item6: "247 Express", item7: "GoGoX", item8: "Mirae Asset",
					item9: "BIDV", item10: "Shuyi", item11: "Acecook Zeppin", item12: "Abbott",
					item13: "EZVIZ", item14: "JOMOO"
				}
			},
			portfolio: {
				pageTitle: "Portfolio — Shine Tu",
				eyebrow: "Sản phẩm của tôi",
				desc: "Tuyển chọn các dự án nhận diện thương hiệu, chiến dịch và trải nghiệm số tôi đã trực tiếp thực hiện, từ concept đầu tiên đến sản phẩm hoàn chỉnh.",
				itemDesc: "Mô tả ngắn gọn về dự án: bài toán cần giải quyết, vai trò của bạn và kết quả đạt được.",
				viewDetails: "Xem chi tiết",
				item1: { title: "Dự án số 01", tag1: "Thiết kế UI", tag2: "Web" },
				item2: { title: "Dự án số 02", tag1: "Phát triển", tag2: "Mobile" },
				item3: { title: "Dự án số 03", tag1: "Thương hiệu", tag2: "Illustration" },
				item4: { title: "Dự án số 04", tag1: "Web App" },
				item5: { title: "Dự án số 05", tag1: "Nội dung" },
				item6: { title: "Dự án số 06", tag1: "Thử nghiệm" },
				cta: { title: "Có dự án muốn hợp tác?", desc: "Tôi luôn sẵn sàng lắng nghe những ý tưởng mới. Hãy để lại lời nhắn cho tôi.", btn: "Liên hệ ngay" }
			},
			blog: {
				pageTitle: "Blog — Shine Tu",
				eyebrow: "Nhật ký",
				desc: "Những bài viết về công việc, quá trình sáng tạo và những điều tôi học được trên đường đi."
			},
			about: {
				pageTitle: "Giới thiệu — Shine Tu",
				eyebrow: "Giới thiệu",
				heroTitle: "Xin chào, tôi là Shine Tu.",
				heroDesc: "Tôi là Art Director với 8 năm kinh nghiệm xây dựng nhận diện thương hiệu, chiến dịch và trải nghiệm số. Công việc của tôi bắt đầu từ một ý tưởng, đi qua từng hệ thống hình ảnh mạch lạc, cho đến khi thành hình cuối cùng — luôn giữ một góc nhìn rõ ràng và làm việc trực tiếp trên từng chi tiết.",
				btnContact: "Liên hệ với tôi",
				btnCV: "Tải CV",
				story: {
					title: "Câu chuyện của tôi",
					p1: "Tôi bắt đầu từ năm 2017 với những dự án tự do đầu tiên, rồi tiếp tục tại Butterflynt, GreenHouse và STITCH Studio, VCCorp/Admicro, TopCV và KMS Technology — mỗi nơi là một cách nhìn khác về thương hiệu, chiến dịch, và cách một ý tưởng trở thành hình ảnh thật.",
					p2: "Hiện tại tôi giữ vai trò Brand & Creative Lead tại FireGroup, phụ trách định hướng hình ảnh cho các sản phẩm và cộng đồng của công ty — từ nhận diện, trải nghiệm web-app, đến không gian sự kiện và merchandise. Tôi làm việc trực tiếp trên từng chi tiết, và để kết quả tự nói lên phần còn lại."
				},
				skills: {
					title: "Kỹ năng",
					item1: "Chỉ đạo nghệ thuật (Art Direction)", item2: "Hệ thống thương hiệu (Brand Systems)", item3: "Chỉ đạo chiến dịch (Campaign Direction)",
					item4: "Trải nghiệm số (Digital Experiences)", item5: "Vẽ tay (Hand-drawing)", item6: "Adobe Creative Suite",
					item7: "AI-assisted Prototyping", item8: "HTML/CSS & GitHub"
				},
				experience: {
					title: "Kinh nghiệm",
					entry1: {
						role: "Brand & Creative Lead — FireGroup",
						desc: "Định hướng hình ảnh cho TryOpenClaw, ClawExperts và Promer — từ nhận diện thương hiệu, trải nghiệm web-app đến không gian sự kiện, merchandise, social và hậu kỳ, phối hợp cùng đội Growth, Product và Engineering. Promer hiện phục vụ hơn 5.000 merchant, hơn 1 triệu quảng cáo đã tạo, đạt 4.7★ trên Shopify.",
						period: "09/2024 — Hiện tại"
					},
					entry2: {
						role: "Senior Creative Contractor — KMS Technology",
						desc: "Thực hiện các dự án sáng tạo theo hợp đồng: illustration, key visual, tài sản số và trang landing page tuyển dụng, phối hợp cùng đội thiết kế nội bộ để đảm bảo tiến độ và chất lượng.",
						period: "02/2024 — 08/2024"
					},
					entry3: {
						role: "Design Team Lead — TopCV Vietnam",
						desc: "Dẫn dắt một nhóm 5 designer trong dự án 6 tháng cho HR Tech Conference 2023 — phát triển ngôn ngữ chiến dịch và triển khai từ key visual đến nội dung sân khấu và sản xuất tại chỗ, phục vụ hơn 800 lãnh đạo doanh nghiệp và nhân sự, 16 diễn giả, tại Landmark 81.",
						period: "07/2023 — 01/2024"
					},
					entry4: {
						role: "Senior Creative Art — VCCorp / Admicro",
						desc: "Thực hiện các giải pháp thương hiệu và chiến dịch cho nhiều nền tảng khách hàng — từ ý tưởng, minh hoạ đến tài sản sản xuất hoàn chỉnh, đồng thời tư vấn chất lượng và tính nhất quán hình ảnh cho đội ngũ và khách hàng.",
						period: "04/2022 — 04/2023"
					},
					entry5: {
						role: "Butterflynt, GreenHouse & STITCH Studio",
						desc: "Illustration, nhận diện thương hiệu, nội dung số, hệ thống trình bày và hình ảnh sự kiện.",
						period: "04/2020 — 05/2022"
					},
					entry6: {
						role: "Independent Creative Practice — Freelance",
						desc: "Các dự án nhận diện thương hiệu, chiến dịch, ra mắt sản phẩm và bán lẻ tự do, cho BIDV, Shuyi, Acecook Zeppin, Abbott, EZVIZ và JOMOO.",
						period: "2017 — Hiện tại"
					}
				},
				education: {
					title: "Học vấn",
					entry1: { role: "Cử nhân Graphic Design — Đại học Mỹ thuật TP.HCM", period: "2017 — 2021" },
					entry2: { role: "Advanced Diploma in Multimedia (loại Giỏi) — FPT Arena Multimedia", period: "2016 — 2018" },
					entry3: { role: "Advanced UX/UI với Figma (ColorME), Art Direction (Domestika), chuyên đề Branding (Coursera)", period: "2022 — 2024" }
				},
				awards: {
					title: "Giải thưởng & Ngôn ngữ",
					entry1: { role: "Giải Nhì — Cuộc thi thiết kế \"Redecorate Your Desktop\"", period: "2018" },
					entry2: { role: "Giải Ba — Lập trình di động, Đại học Công nghệ Thông tin", period: "2017" },
					languages: "Ngôn ngữ: Tiếng Việt, Tiếng Anh (B2), Tiếng Quan Thoại, Tiếng Quảng Đông"
				},
				testimonials: {
					title: "Mọi người nói gì",
					quote1: "\"Tôi có cơ hội làm việc cùng Oanh trong ba tháng khi bạn ấy là designer hợp đồng tại KMS Technology. Trong thời gian đó, Oanh thể hiện sự chuyên nghiệp, khả năng sáng tạo cùng kỹ năng giao tiếp xuất sắc. Bạn ấy đã có những đóng góp giá trị cho nhóm, bao gồm việc hướng dẫn các thành viên khác và luôn giữ thái độ chủ động, tích cực. Sự tận tâm và tài năng của Oanh mang lại lợi ích đáng kể cho các dự án của chúng tôi, và bạn ấy thực sự là một nhân tố quan trọng của nhóm thiết kế.\"",
					role1: "Quản lý trực tiếp tại KMS Technology"
				}
			},
			contact: {
				pageTitle: "Liên hệ — Shine Tu",
				eyebrow: "Liên hệ",
				title: "Hãy cùng tạo nên điều tuyệt vời!",
				desc: "Bạn có dự án, ý tưởng hợp tác hay chỉ đơn giản muốn chào hỏi? Điền vào biểu mẫu bên dưới hoặc liên hệ trực tiếp qua email, điện thoại, LinkedIn, Behance hay Telegram của tôi.",
				form: { name: "Họ và tên", subject: "Chủ đề", message: "Nội dung", submit: "Gửi tin nhắn" },
				info: { locationLabel: "Địa điểm", locationValue: "Việt Nam", socialLabel: "Mạng xã hội", phoneLabel: "Điện thoại" }
			}
		},
		en: {
			site: { name: "Shine Tu" },
			nav: { home: "Home", portfolio: "Portfolio", blog: "Blog", about: "About", contact: "Contact" },
			lang: { groupLabel: "Select language" },
			menu: { toggleLabel: "Open menu" },
			footer: {
				copyright: "© 2026 Shine Tu",
				themeCredit: "Design based on the <a href=\"https://andersnoren.se/themes/bjork/\" target=\"_blank\" rel=\"noopener\">Björk</a> theme by Anders Norén"
			},
			home: {
				pageTitle: "Home — Shine Tu",
				hero: {
					kicker: "Hi there!",
					title: "I'm Shine Tu — Art Director / Senior Creative Designer.",
					desc: "In a world full of noise, let your design be heard. This is my little corner of the internet where I keep my work, my writing, and my story.",
					btnContact: "Get in touch",
					btnAbout: "About me"
				},
				intro: {
					p1: "From my first freelance projects in 2017 to my current role as Brand & Creative Lead at FireGroup, I work from a first idea through to a complete visual system — always starting from the real story behind each brand.",
					p2: "Outside of work, I enjoy experimenting with small ideas, writing about what I learn, and sharing it on my personal blog."
				},
				card1: { title: "View my work", desc: "Explore the projects I've built and the skills I've developed along the way.", btn: "See more" },
				card2: { title: "Get in touch", desc: "Want to collaborate or just chat about a new project? Send me a message.", btn: "Contact" },
				card3: { title: "Follow the journey", desc: "Read my latest posts about design, creativity, and life.", btn: "Read the blog" },
				clients: {
					title: "Worked with",
					item1: "L'Oréal", item2: "Nestlé", item3: "Toshiba", item4: "Vichy",
					item5: "La Roche-Posay", item6: "247 Express", item7: "GoGoX", item8: "Mirae Asset",
					item9: "BIDV", item10: "Shuyi", item11: "Acecook Zeppin", item12: "Abbott",
					item13: "EZVIZ", item14: "JOMOO"
				}
			},
			portfolio: {
				pageTitle: "Portfolio — Shine Tu",
				eyebrow: "My Work",
				desc: "A selection of brand, campaign and digital experience projects I've worked on directly, from first concept to finished product.",
				itemDesc: "Short project description: the problem you solved, your role, and the outcome.",
				viewDetails: "View details",
				item1: { title: "Project 01", tag1: "UI Design", tag2: "Web" },
				item2: { title: "Project 02", tag1: "Development", tag2: "Mobile" },
				item3: { title: "Project 03", tag1: "Branding", tag2: "Illustration" },
				item4: { title: "Project 04", tag1: "Web App" },
				item5: { title: "Project 05", tag1: "Content" },
				item6: { title: "Project 06", tag1: "Experiment" },
				cta: { title: "Have a project in mind?", desc: "I'm always happy to hear new ideas. Send me a message.", btn: "Contact me" }
			},
			blog: {
				pageTitle: "Blog — Shine Tu",
				eyebrow: "Journal",
				desc: "Posts about my work, my creative process, and things I learn along the way."
			},
			about: {
				pageTitle: "About — Shine Tu",
				eyebrow: "About",
				heroTitle: "Hi, I'm Shine Tu.",
				heroDesc: "I'm an Art Director with 8 years of experience shaping brand identities, campaigns and digital experiences. My work starts from a first idea, moves through coherent visual systems, and carries all the way to its final form — always with a clear point of view and hands-on craft.",
				btnContact: "Get in touch",
				btnCV: "Download CV",
				story: {
					title: "My story",
					p1: "I started in 2017 with my first freelance projects, then continued at Butterflynt, GreenHouse and STITCH Studio, VCCorp/Admicro, TopCV and KMS Technology — each one a different way of thinking about brand, campaign, and how an idea becomes a real image.",
					p2: "I'm currently Brand & Creative Lead at FireGroup, setting visual direction for the company's products and community — from identity and web-app experiences to event environments and merchandise. I work hands-on with every detail, and let the results speak for the rest."
				},
				skills: {
					title: "Skills",
					item1: "Art Direction", item2: "Brand Systems", item3: "Campaign Direction",
					item4: "Digital Experiences", item5: "Hand-drawing", item6: "Adobe Creative Suite",
					item7: "AI-assisted Prototyping", item8: "HTML/CSS & GitHub"
				},
				experience: {
					title: "Experience",
					entry1: {
						role: "Brand & Creative Lead — FireGroup",
						desc: "Setting visual direction across TryOpenClaw, ClawExperts and Promer — from brand identity and web-app experiences to event environments, merchandise, social and post-production, working alongside Growth, Product and Engineering. Promer now serves 5,000+ merchants with 1M+ ads generated, at a 4.7★ Shopify rating.",
						period: "Sep 2024 — Present"
					},
					entry2: {
						role: "Senior Creative Contractor — KMS Technology",
						desc: "Delivered campaign-based creative work under contract — illustration, key visuals, digital assets and a career landing page, partnering with the internal design team on timeline and quality.",
						period: "Feb 2024 — Aug 2024"
					},
					entry3: {
						role: "Design Team Lead — TopCV Vietnam",
						desc: "Led a 5-person design team through a six-month engagement for HR Tech Conference 2023 — developing the campaign language and carrying it from key visual through stage content and on-site production, for 800+ business and HR leaders and 16 speakers at Landmark 81.",
						period: "Jul 2023 — Jan 2024"
					},
					entry4: {
						role: "Senior Creative Art — VCCorp / Admicro",
						desc: "Created brand and campaign solutions across multiple client platforms — from concepts and illustration to production-ready assets, advising teams and clients on quality and visual consistency.",
						period: "Apr 2022 — Apr 2023"
					},
					entry5: {
						role: "Butterflynt, GreenHouse & STITCH Studio",
						desc: "Illustration, brand identity, digital content, presentation systems and event visuals.",
						period: "Apr 2020 — May 2022"
					},
					entry6: {
						role: "Independent Creative Practice — Freelance",
						desc: "Ongoing freelance identity, campaign, launch and retail work for BIDV, Shuyi, Acecook Zeppin, Abbott, EZVIZ and JOMOO.",
						period: "2017 — Present"
					}
				},
				education: {
					title: "Education",
					entry1: { role: "Bachelor of Arts in Graphic Design — Ho Chi Minh City University of Fine Arts", period: "2017 — 2021" },
					entry2: { role: "Advanced Diploma in Multimedia, Distinction Grade — FPT Arena Multimedia", period: "2016 — 2018" },
					entry3: { role: "Advanced UX/UI with Figma (ColorME), Art Direction (Domestika), Branding specialization (Coursera)", period: "2022 — 2024" }
				},
				awards: {
					title: "Awards & Languages",
					entry1: { role: "Second Prize — \"Redecorate Your Desktop\" Desktop Wallpaper Design Contest", period: "2018" },
					entry2: { role: "Third Prize — Mobile Programming, University of Information Technology", period: "2017" },
					languages: "Languages: Vietnamese, English (B2), Mandarin, Cantonese"
				},
				testimonials: {
					title: "What people say",
					quote1: "\"I had the pleasure of working with Oanh for three months while she was a contracted designer at KMS Technology. During this time, Oanh demonstrated her professionalism and creativity, along with excellent communication skills. She made valuable contributions to our team, including mentoring other members and consistently displaying a proactive and positive attitude. Oanh's dedication and talent significantly benefited our projects, and she was a key asset to the design team.\"",
					role1: "Direct manager at KMS Technology"
				}
			},
			contact: {
				pageTitle: "Contact — Shine Tu",
				eyebrow: "Contact",
				title: "Let's make great things together!",
				desc: "Have a project, a collaboration idea, or just want to say hi? Fill out the form below or reach out directly via email, phone, LinkedIn, Behance, or Telegram.",
				form: { name: "Full name", subject: "Subject", message: "Message", submit: "Send message" },
				info: { locationLabel: "Location", locationValue: "Vietnam", socialLabel: "Social", phoneLabel: "Phone" }
			}
		}
	};

	function translate(lang, key) {
		var parts = key.split(".");
		var node = translations[lang];
		for (var i = 0; i < parts.length; i++) {
			if (node == null) return null;
			node = node[parts[i]];
		}
		return typeof node === "string" ? node : null;
	}

	function applyLanguage(lang) {
		document.documentElement.setAttribute("lang", lang);

		document.querySelectorAll("[data-i18n]").forEach(function (el) {
			var value = translate(lang, el.getAttribute("data-i18n"));
			if (value !== null) el.textContent = value;
		});

		document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
			var value = translate(lang, el.getAttribute("data-i18n-html"));
			if (value !== null) el.innerHTML = value;
		});

		document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
			var value = translate(lang, el.getAttribute("data-i18n-placeholder"));
			if (value !== null) el.setAttribute("placeholder", value);
		});

		document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
			var value = translate(lang, el.getAttribute("data-i18n-aria"));
			if (value !== null) el.setAttribute("aria-label", value);
		});

		// Inline bilingual content (used by CMS-generated pages such as /portfolio,
		// where text comes from the database instead of the static dictionary above).
		document.querySelectorAll("[data-i18n-vi]").forEach(function (el) {
			var value = el.getAttribute(lang === "en" ? "data-i18n-en" : "data-i18n-vi");
			if (value) el.textContent = value;
		});

		// Same as data-i18n-vi/-en, but allows inline HTML (e.g. <strong>) inside
		// CMS-authored copy such as portfolio detail blocks.
		document.querySelectorAll("[data-i18n-html-vi]").forEach(function (el) {
			var value = el.getAttribute(lang === "en" ? "data-i18n-html-en" : "data-i18n-html-vi");
			if (value) el.innerHTML = value;
		});

		document.querySelectorAll(".lang-btn").forEach(function (btn) {
			var isActive = btn.getAttribute("data-lang") === lang;
			btn.classList.toggle("is-active", isActive);
			btn.setAttribute("aria-pressed", String(isActive));
		});

		try { localStorage.setItem("site-lang", lang); } catch (e) {}
	}

	function getInitialLanguage() {
		try {
			var saved = localStorage.getItem("site-lang");
			if (saved === "vi" || saved === "en") return saved;
		} catch (e) {}
		return "vi";
	}

	document.addEventListener("DOMContentLoaded", function () {
		try {
			applyLanguage(getInitialLanguage());
		} finally {
			document.documentElement.removeAttribute("data-i18n-loading");
		}

		document.querySelectorAll(".lang-btn").forEach(function (btn) {
			btn.addEventListener("click", function () {
				applyLanguage(btn.getAttribute("data-lang"));
			});
		});

		document.querySelectorAll(".theme-toggle").forEach(function (btn) {
			btn.setAttribute("aria-pressed", String(document.documentElement.getAttribute("data-theme") === "dark"));
			btn.addEventListener("click", function () {
				var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
				document.documentElement.setAttribute("data-theme", next);
				btn.setAttribute("aria-pressed", String(next === "dark"));
				try { localStorage.setItem("theme", next); } catch (e) {}
			});
		});

		var toggle = document.querySelector(".menu-toggle");
		var nav = document.querySelector(".mobile-nav");

		if (toggle && nav) {
			toggle.addEventListener("click", function () {
				nav.classList.toggle("is-open");
				var expanded = toggle.getAttribute("aria-expanded") === "true";
				toggle.setAttribute("aria-expanded", String(!expanded));
			});
		}

		var current = window.location.pathname.split("/").pop() || "index.html";
		document.querySelectorAll(".sidebar-nav a, .mobile-nav a").forEach(function (link) {
			var href = link.getAttribute("href");
			if (href === current) {
				link.classList.add("is-active");
			}
		});
	});
})();
