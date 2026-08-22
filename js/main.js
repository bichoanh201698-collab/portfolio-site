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
					p1: "Từ những dự án thiết kế tự do đầu tiên năm 2017 đến vai trò Senior Graphic Designer tại FireGroup Technology hôm nay, tôi tin rằng thiết kế tốt luôn bắt đầu từ việc lắng nghe câu chuyện thật đằng sau mỗi thương hiệu, rồi chuyển hoá nó thành hình ảnh rõ ràng, chạm đến người xem.",
					p2: "Ngoài công việc, tôi thích thử nghiệm những ý tưởng nhỏ, viết lại quá trình học hỏi của mình và chia sẻ chúng trên blog cá nhân."
				},
				card1: { title: "Xem portfolio", desc: "Khám phá những dự án tôi đã thực hiện và các kỹ năng tôi đã trau dồi.", btn: "Xem thêm" },
				card2: { title: "Kết nối với tôi", desc: "Muốn hợp tác hoặc trò chuyện về một dự án mới? Gửi cho tôi một tin nhắn.", btn: "Liên hệ" },
				card3: { title: "Theo dõi hành trình", desc: "Đọc những bài viết mới nhất của tôi về thiết kế, sáng tạo và cuộc sống.", btn: "Đọc blog" },
				clients: {
					title: "Đã đồng hành cùng",
					item1: "L'Oréal", item2: "Nestlé", item3: "Toshiba", item4: "Abbott",
					item5: "KMS Technology", item6: "247 Express", item7: "Masan"
				}
			},
			portfolio: {
				pageTitle: "Portfolio — Shine Tu",
				eyebrow: "Sản phẩm của tôi",
				desc: "Tổng hợp những dự án tôi đã tự tay thực hiện — từ thiết kế, phát triển sản phẩm đến các thử nghiệm cá nhân.",
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
				heroDesc: "Tôi là Art Director / Senior Creative Designer với 7 năm kinh nghiệm phục vụ đa dạng khách hàng trong nhiều ngành, chuyên về Thiết kế đồ hoạ 2D gắn liền với mục tiêu thương mại và marketing. Tôi thích biến những ý tưởng thành sản phẩm thật, và luôn tìm cách học hỏi điều mới mỗi ngày.",
				btnContact: "Liên hệ với tôi",
				btnCV: "Tải CV",
				story: {
					title: "Câu chuyện của tôi",
					p1: "Hành trình của tôi bắt đầu từ năm 2017, khi tôi nhận những dự án thiết kế tự do đầu tiên — vừa làm, vừa học, vừa tìm ra chất riêng của mình trong từng nét vẽ. Từ những bản phác thảo tay đến các chiến dịch thương hiệu chạy trên mạng xã hội và ngoài trời, tôi dần hiểu rằng thiết kế giỏi không nằm ở kỹ thuật, mà ở khả năng biến một ý tưởng mơ hồ thành hình ảnh khiến người xem phải dừng lại.",
					p2: "Từ vị trí thiết kế viên tại VCCorp đến vai trò dẫn dắt một nhóm thiết kế tại TopCV Vietnam, tôi học được rằng công việc sáng tạo hay nhất luôn là công việc của một tập thể. Hiện tại, với vai trò Senior Graphic Designer tại FireGroup Technology, tôi vẫn giữ nguyên tinh thần đó: mỗi pixel đặt xuống đều nên kể một câu chuyện, và câu chuyện ấy phải vừa đẹp, vừa đúng mục tiêu kinh doanh."
				},
				skills: {
					title: "Kỹ năng",
					item1: "Thiết kế đồ hoạ (Graphic Design)", item2: "Xây dựng thương hiệu (Branding)", item3: "Vẽ tay (Hand-drawing)",
					item4: "Thiết kế UI", item5: "Adobe Creative Suite", item6: "Chỉ đạo sáng tạo (Creative Direction)"
				},
				experience: {
					title: "Kinh nghiệm",
					entry1: {
						role: "Senior Graphic Designer — FireGroup Technology",
						desc: "Thiết kế đồ hoạ cho các sản phẩm số của công ty, tập trung vào Online Graphics và Image Design.",
						period: "09/2024 — Hiện tại"
					},
					entry2: {
						role: "Senior Graphic Designer — KMS Technology, Inc. (Hợp đồng)",
						desc: "Phát triển ý tưởng sáng tạo (Creative Concept Design) trong một dự án ngắn hạn.",
						period: "03/2024 — 06/2024"
					},
					entry3: {
						role: "Team Leader of Graphic Design — TopCV Vietnam",
						desc: "Dẫn dắt một nhóm 3 designer từ ý tưởng đến hoàn thiện, quản lý tiến độ - nguồn lực - ngân sách, góp ý chuyên môn và giữ vững chất lượng đồng nhất, đồng thời xây dựng môi trường làm việc sáng tạo và gắn kết cho cả nhóm.",
						period: "07/2023 — 01/2024"
					},
					entry4: {
						role: "Senior Graphic Designer — VCCorp",
						desc: "Thiết kế thương hiệu (Branding) cho ứng dụng, bài đăng mạng xã hội (Facebook, Instagram, Email...) và biển quảng cáo ngoài trời (OOH); linh hoạt nhiều phong cách từ pixel, cartoon đến hiện thực để đáp ứng từng nhu cầu dự án.",
						period: "04/2022 — 2023"
					},
					entry5: {
						role: "Creative Graphic Designer — Freelance",
						desc: "Nhận các dự án thiết kế tự do về Graphic Design, Branding & Identity cho nhiều khách hàng khác nhau.",
						period: "Từ 2017"
					}
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
				desc: "Bạn có dự án, ý tưởng hợp tác hay chỉ đơn giản muốn chào hỏi? Điền vào biểu mẫu bên dưới hoặc liên hệ trực tiếp qua email, LinkedIn, Behance hay Telegram của tôi.",
				form: { name: "Họ và tên", subject: "Chủ đề", message: "Nội dung", submit: "Gửi tin nhắn" },
				info: { locationLabel: "Địa điểm", locationValue: "Việt Nam", socialLabel: "Mạng xã hội" }
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
					p1: "From my first freelance projects back in 2017 to my current role as a Senior Graphic Designer at FireGroup Technology, I believe good design always starts with listening to the real story behind every brand, then turning it into something clear that truly connects.",
					p2: "Outside of work, I enjoy experimenting with small ideas, writing about what I learn, and sharing it on my personal blog."
				},
				card1: { title: "View my work", desc: "Explore the projects I've built and the skills I've developed along the way.", btn: "See more" },
				card2: { title: "Get in touch", desc: "Want to collaborate or just chat about a new project? Send me a message.", btn: "Contact" },
				card3: { title: "Follow the journey", desc: "Read my latest posts about design, creativity, and life.", btn: "Read the blog" },
				clients: {
					title: "Worked with",
					item1: "L'Oréal", item2: "Nestlé", item3: "Toshiba", item4: "Abbott",
					item5: "KMS Technology", item6: "247 Express", item7: "Masan"
				}
			},
			portfolio: {
				pageTitle: "Portfolio — Shine Tu",
				eyebrow: "My Work",
				desc: "A collection of projects I've built myself — from design and product development to personal experiments.",
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
				heroDesc: "I'm an Art Director / Senior Creative Designer with 7 years of experience serving diverse clients across industries, specializing in 2D graphic design aligned with commercial and marketing goals. I love turning ideas into real products, and I'm always looking to learn something new.",
				btnContact: "Get in touch",
				btnCV: "Download CV",
				story: {
					title: "My story",
					p1: "My journey began back in 2017, taking on my first freelance design projects — learning by doing, and slowly finding my own voice in every sketch. From hand-drawn illustrations to branding campaigns running across social media and outdoor billboards, I came to understand that great design isn't about technique alone, but about turning a vague idea into an image that makes people pause.",
					p2: "From a design role at VCCorp to leading a design team at TopCV Vietnam, I learned that the best creative work is always a team effort. Today, as a Senior Graphic Designer at FireGroup Technology, I carry that same spirit forward: every pixel I place should tell a story — one that's both beautiful and true to the business behind it."
				},
				skills: {
					title: "Skills",
					item1: "Graphic Design", item2: "Branding", item3: "Hand-drawing",
					item4: "UI Design", item5: "Adobe Creative Suite", item6: "Creative Direction"
				},
				experience: {
					title: "Experience",
					entry1: {
						role: "Senior Graphic Designer — FireGroup Technology",
						desc: "Graphic design for the company's digital products, focused on online graphics and image design.",
						period: "Sep 2024 — Present"
					},
					entry2: {
						role: "Senior Graphic Designer — KMS Technology, Inc. (Contract)",
						desc: "Creative concept design for a short-term engagement.",
						period: "Mar 2024 — Jun 2024"
					},
					entry3: {
						role: "Team Leader of Graphic Design — TopCV Vietnam",
						desc: "Led a team of 3 designers from concept to completion, managing timelines, resources, and budgets, giving feedback to keep quality consistent, and building a collaborative, creative team culture.",
						period: "Jul 2023 — Jan 2024"
					},
					entry4: {
						role: "Senior Graphic Designer — VCCorp",
						desc: "Branding design for apps, social media posts (Facebook, Instagram, Email...), and outdoor advertising (OOH); working flexibly across styles from pixel art to cartoon to realistic illustration depending on the project.",
						period: "Apr 2022 — 2023"
					},
					entry5: {
						role: "Creative Graphic Designer — Freelance",
						desc: "Freelance graphic design and branding & identity projects for a range of clients.",
						period: "Since 2017"
					}
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
				desc: "Have a project, a collaboration idea, or just want to say hi? Fill out the form below or reach out directly via email, LinkedIn, Behance, or Telegram.",
				form: { name: "Full name", subject: "Subject", message: "Message", submit: "Send message" },
				info: { locationLabel: "Location", locationValue: "Vietnam", socialLabel: "Social" }
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
