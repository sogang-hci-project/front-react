export enum SystemStatus {
	PAUSE = 'PAUSE',
	READY = 'READY',
	LISTEN = 'LISTEN',
	TRANSCRIBE = 'TRANSCRIBE',
	GENERATE = 'GENERATE',
	SPEAK = 'SPEAK',
	WAIT = 'WAIT',
	MUTE = 'MUTE',
}

export enum ServiceType {
	CLOVA_TTS = 'CLOVA_TTS',
	CLOVA_STT = 'CLOVA_STT',
	OPENAI = 'OPENAI',
	GCLOUD_TTS = 'GCLOUD_TTS',
	GCLOUD_STT = 'GCLOUD_STT',
	PAPAGO_TRANS = 'PAPAGO_TRANS',
	LOCAL_STT = 'LOCAL_STT',
	BACKEND = 'BACKEND',
	BACKEND_INIT = 'BACKEND_INIT',
}

export enum LANGUAGE {
	US = 'en-US',
	KR = 'ko-KR',
}

export enum LocalPATH {
	INTERACT = 'interact',
	PROBE = 'probe',
	SETTING = 'setting',
}
