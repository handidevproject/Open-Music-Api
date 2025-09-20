class Listener {
    constructor(playlistsSongsService, mailSender) {
        this._playlistsSongsService = playlistsSongsService;
        this._mailSender = mailSender;
    }

    async listen(message) {
        try {
            const { playlistId, targetEmail } = JSON.parse(message.content.toString());

            // Ambil playlist lengkap dengan lagu
            const playlist = await this._playlistsSongsService.getSongsFromPlaylist(playlistId);

            const exported = { playlist };

            // Kirim email
            await this._mailSender.sendEmail(
                targetEmail,
                JSON.stringify(exported, null, 2),
                `Export Playlist - ${playlist.name}`,
            );

            console.log(`Email terkirim ke ${targetEmail}`);
        } catch (error) {
            console.error('Gagal memproses pesan:', error);
        }
    }
}

module.exports = Listener;
