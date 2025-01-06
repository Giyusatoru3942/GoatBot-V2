const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "admin",
		version: "1.6",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			vi: "Thêm, xóa, sửa quyền admin",
			en: "Add, remove, edit admin role"
		},
		category: "box chat",
		guide: {
			vi: '   {pn} [add | -a] <uid | @tag>: Thêm quyền admin cho người dùng'
				+ '\n	  {pn} [remove | -r] <uid | @tag>: Xóa quyền admin của người dùng'
				+ '\n	  {pn} [list | -l]: Liệt kê danh sách admin',
			en: '   {pn} [add | -a] <uid | @tag>: Add admin role for user'
				+ '\n	  {pn} [remove | -r] <uid | @tag>: Remove admin role of user'
				+ '\n	  {pn} [list | -l]: List all admins'
		}
	},

	langs: {
		vi: {
			added: "✅ | Đã thêm quyền admin cho %1 người dùng:\n%2",
			alreadyAdmin: "\n⚠️ | %1 người dùng đã có quyền admin từ trước rồi:\n%2",
			missingIdAdd: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn thêm quyền admin",
			removed: "✅ | Đã xóa quyền admin của %1 người dùng:\n%2",
			notAdmin: "⚠️ | %1 người dùng không có quyền admin:\n%2",
			missingIdRemove: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn xóa quyền admin",
			listAdmin: "👑 | Danh sách admin:\n%1"
		},
		en: {
			added: "✅ | 𝐋𝐞 𝐧𝐨𝐮𝐯𝐞𝐚𝐮 𝐚𝐝𝐦𝐢𝐧 𝐝𝐮 𝐜𝐥𝐚𝐧 𝐞𝐬𝐭 %1 users:\n%2",
			alreadyAdmin: "\n⚠️ | %1 𝐀𝐥𝐞𝐫𝐭𝐞 𝐯𝐨𝐮𝐬 𝐣𝐨𝐮𝐞 𝐝𝐞́𝐣𝐚̀ 𝐥𝐞 𝐫𝐨̂𝐥𝐞 𝐝𝐞 𝐥'𝐚𝐝𝐦𝐢𝐧:\n%2",
			missingIdAdd: "⚠️ | 𝐃𝐞́𝐬𝐨𝐥𝐞́ 𝐞𝐧𝐭𝐫𝐞 𝐈𝐃 𝐨𝐮 𝐭𝐚𝐠𝐮𝐞 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐧𝐞 𝐪𝐮𝐞 𝐯𝐨𝐮𝐬 𝐬𝐨𝐮𝐡𝐚𝐢𝐭𝐞 𝐚𝐣𝐨𝐮𝐭𝐞 𝐚𝐮𝐱  𝐚𝐝𝐦𝐢𝐧𝐬",
			removed: "✅ |𝐋'𝐚𝐝𝐦𝐢𝐧 𝐚𝐲𝐚𝐧𝐭 𝐞́𝐭𝐞́ 𝐫𝐞𝐭𝐢𝐫𝐞 𝐞𝐬𝐭  %1 users:\n%2",
			notAdmin: "⚠️ |𝐚𝐥𝐞𝐫𝐭𝐞 𝐯𝐨𝐮𝐬 𝐞́𝐭𝐞́𝐬 𝐩𝐚𝐬 𝐚𝐝𝐦𝐢𝐧 𝐝𝐮 𝐛𝐨𝐭 %1 users:\n%2",
			missingIdRemove: "⚠️ | 𝐃𝐞́𝐬𝐨𝐥𝐞́ 𝐞𝐧𝐭𝐫𝐞 𝐈𝐃 𝐨𝐮 𝐭𝐚𝐠𝐮𝐞 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐧𝐞 𝐪𝐮𝐞 𝐯𝐨𝐮𝐬 𝐬𝐨𝐮𝐡𝐚𝐢𝐭𝐞 𝐫𝐞𝐭𝐢𝐫𝐞 𝐝𝐞𝐬 𝐚𝐝𝐦𝐢𝐧𝐬 ",
			listAdmin: "🔮 | 𝐋𝐈𝐒𝐓𝐄 𝐃'𝐀𝐃𝐌𝐈𝐍𝐒:\n✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {
		switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions)[0];
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					for (const uid of adminIds)
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
					const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}
			default:
				return message.SyntaxError();
		}
	}
};
