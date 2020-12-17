import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { Box, mergeClass, Text } from 'goods-core';
import { useParsedLocation } from 'src/hooks/parsed-location';

/**
 *
 * @param {React.MouseEvent<HTMLAnchorElement>} e
 */
function isModifiedEvent(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}

/** @type {React.NamedExoticComponent<import('./link').LinkProps>} */
const Link = memo(
  ({
    to = '#',
    target = '_self',
    method,
    className,
    c,
    rule = 'body',
    dRule,
    fontFam,
    fSize,
    weight,
    lineHeight,
    letterSpace,
    textAlign,
    onClick,
    children,
    ...props
  }) => {
    const { getHref, goTo, search, pathname } = useParsedLocation();

    const { href, isCurrentLocation, isExternalLink } = useMemo(() => {
      const _href = getHref(to);
      return {
        href: _href,
        isCurrentLocation: _href === `${pathname}${search}`,
        isExternalLink: ['http', 'tel', 'mailto'].some(prefix =>
          (_href || '').startsWith(prefix)
        ),
      };
    }, [to, search, pathname]);

    /** @param {React.MouseEvent} e */
    function _onClick(e) {
      if (isCurrentLocation) {
        if (isModifiedEvent(e)) return;
        e.preventDefault();
        return;
      }

      try {
        if (typeof onClick === 'function') onClick(e);
      } catch (error) {
        e.preventDefault();
        throw error;
      }

      if (!href) {
        e.preventDefault();
        return;
      }

      if (
        !e.defaultPrevented &&
        e.button === 0 &&
        (!target || target === '_self') &&
        !isModifiedEvent(e) &&
        !isExternalLink
      ) {
        e.preventDefault();
        goTo(href, { method });
      }
    }

    return (
      <Box
        cursor='pointer'
        b='none'
        outline='none'
        className={mergeClass('link', className)}
        {...props}
        as='a'
        href={href}
        target={target}
        onClick={_onClick}
      >
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text
            as='span'
            rule={rule}
            dRule={dRule}
            fontFam={fontFam}
            c={c}
            textAlign={textAlign}
            {...(fSize && { fSize })}
            {...(weight && { weight })}
            {...(lineHeight && { lineHeight })}
            {...(letterSpace && { letterSpace })}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Box>
    );
  },
  isEqual
);

export default Link;
