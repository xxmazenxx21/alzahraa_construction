# Careers application email

Both English and Arabic forms submit to `/pages/en/careers/submit.php`. The email contains every application field and the uploaded CV attachment. The recipient is fixed to `info@alzahraa.construction`. Visitors cannot change it. Applicants' email addresses are used as Reply-To, not From.

Deploy the page and `submit.php` on PHP-enabled Hostinger hosting (PHP 8.1+, mbstring, fileinfo and ZipArchive for DOCX). A static-only server such as Python's preview server cannot process this endpoint. For local development, use `php -S localhost:5501 -t .` from the repository root.

Configure the host's outbound PHP mail transport and an authenticated sender on the hosting domain. The default From address is `info@alzahraa-construction.com`; set the server environment variable `CAREERS_MAIL_FROM` to your actual authorised mailbox if different. Keep the recipient as `info@alzahraa.construction`. Set `upload_max_filesize` to at least `5M` and `post_max_size` to at least `8M`.

The endpoint validates fields, consent, CSRF, upload content/extension and the 5 MB file limit. It restricts applications to five per IP address per 15 minutes. CV files are read from PHP's temporary upload directory and never published or permanently stored on the website. The form preserves input if a submission fails and only resets after the mail transport accepts the email.

Verify one real application and attachment in the recipient mailbox after deployment. PHP mail acceptance does not guarantee inbox delivery; SPF/DKIM and the host's outbound mail configuration still matter. Reference: https://www.php.net/manual/en/function.mail.php

Images were copied from existing workspace assets into the Careers page's own image folder. Both languages use those files. No media was downloaded. Gallery captions now describe the actual team and road photos, rather than unavailable stock blueprint/surveying photos. The hero remains photographic until `hero-careers.mp4` is supplied.
