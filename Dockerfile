FROM docker-dev.freeletics.com/rails-baseimage:rc-2017-07-19_13-39

# install rvm
ENV RVM_INSTALLER https://raw.githubusercontent.com/rvm/rvm/b78c7b04428d2f91fffc17d83f3c1323248a38fc/binscripts/rvm-installer
#ENV RVM_INSTALLER https://get.rvm.io
RUN gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 \
  && curl -sL ${RVM_INSTALLER} | bash -s stable \
  && bash -il -c "rvm requirements" \
  && echo "rvm_install_on_use_flag=1" >> /etc/rvmrc \
  && echo "bundler" >> /usr/local/rvm/gemsets/default.gems \
  && rm -rf /var/lib/apt/lists/*

ENV PATH="/usr/local/rvm/bin/:$PATH"

RUN rvm install 2.4.1
