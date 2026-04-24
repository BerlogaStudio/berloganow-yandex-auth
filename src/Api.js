/**
 * Minimal client — we no longer use Yandex password grant (broken on 2FA accounts).
 * The user signs in to Yandex directly via Implicit OAuth in a new tab and pastes
 * the redirect URL back; we only forward the extracted access_token to our bot
 * backend.
 */
class YandexMusicApi {
    serialize = (obj) => {
        const str = [];
        for (const p in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join("&");
    };

    send_token_to_backend = async (backendUrl, hash, token) => {
        const resp = await fetch(backendUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: this.serialize({hash, token}),
        });
        if (!resp.ok) {
            let message = 'Backend error ' + resp.status;
            try {
                const json = await resp.json();
                if (json && json.error) message = json.error;
            } catch (_) { /* noop */ }
            throw new Error(message);
        }
        return resp;
    };
}

export {YandexMusicApi};
