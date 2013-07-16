NODE = node
SAMPLES = download-request-aborted.js failed-put-request.js get-request-aborted.js \
	  put-request-aborted-by-server.js put-request-aborted.js put-request-aborted2.js \
	  put-request-default-timeout.js simple-get-request.js simple-put-request.js

SAMPLE_TARGETS = $(subst .js,.test,$(SAMPLES))

all: $(SAMPLE_TARGETS)

%.test: %.js
	$(NODE) $<
