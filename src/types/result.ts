type Ok<T> = {
	success: true;
	data: T;
	error?: never;
};

type Fail<E extends Error = Error> = {
	success: false;
	data?: never;
	error: E;
};

export type Result<T, E extends Error = Error> = Ok<T> | Fail<E>;

export const Ok = <T>(data: T): Ok<T> => ({
	success: true,
	data,
});

export const Err = <E extends Error = Error>(error: E): Fail<E> => ({
	success: false,
	error,
});
